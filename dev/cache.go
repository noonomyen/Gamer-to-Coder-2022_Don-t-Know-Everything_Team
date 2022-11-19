package main

import (
	"crypto/md5"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"io"
	"io/fs"
	"log"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gin-gonic/gin/render"
)

const cache_path string = "./cache"
const cache_folder_permission fs.FileMode = 0755
const cache_list string = "./cache/cache.json"
const cache_list_permission fs.FileMode = 0644
const cache_file_permission fs.FileMode = 0644

var CacheList map[string]interface{}

// var OnMemory map[string][]byte

func copy_map_string_interface(ORIGINAL interface{}) map[string]interface{} {
	var tmp = map[string]interface{}{}
	for key, value := range ORIGINAL.(map[string]interface{}) {
		tmp[key] = value
	}
	return tmp
}

func load_cache_list() error {
	ReadFile, err := os.ReadFile(cache_list)
	if err != nil {
		return err
	} else {
		err := json.Unmarshal([]byte(ReadFile), &CacheList)
		if err != nil {
			return err
		}
	}
	return nil
}

func save_cache_list() {
	WriteFile, err := json.MarshalIndent(CacheList, "", "    ")
	if err != nil {
		log.Fatal(err)
	} else {
		err := os.WriteFile(cache_list, WriteFile, cache_list_permission)
		if err != nil {
			fmt.Printf("\nCan't write cache list file : %s\n\n", cache_list)
			log.Fatal(err)
		}
	}
}

func new_cache() {
	dir, err := os.Stat(cache_path)
	if err != nil {
		os.Mkdir("cache", cache_folder_permission)
	} else {
		if dir.IsDir() {
			os.RemoveAll(cache_path)
		} else {
			fmt.Printf("\n%s is not a directory.\n\n", cache_list)
			os.Exit(1)
		}
		os.Mkdir("cache", cache_folder_permission)
	}
	CacheList = map[string]interface{}{}
	// OnMemory = map[string][]byte{}
	save_cache_list()
}

func add_cache(URL *string, Body *[]byte, Time *time.Time, content_type *string) {
	hasher := md5.New()
	hasher.Write([]byte(*URL))
	hash_url := hex.EncodeToString(hasher.Sum(nil))
	err := os.WriteFile(cache_path+"/"+hash_url, *Body, cache_file_permission)
	if err != nil {
		fmt.Printf("\nCan't write file : %s\n\n", cache_path+"/"+hash_url)
		log.Fatal(err)
	} else {
		CacheList[*URL] = map[string]interface{}{
			"hash-url":     hash_url,
			"last-updated": Time.Format(time.RFC3339),
			"timestamp":    Time.Unix(),
			"content-type": *content_type,
		}
		save_cache_list()
	}
}

func remove_cache(URL *string) {
	file := cache_path + "/" + CacheList[*URL].(map[string]interface{})["hash-url"].(string)
	err := os.Remove(file)
	if err != nil {
		log.Printf("[ERROR] [cache][remove_cache] : %s\n", file)
		if Config.Dev.Debug_Fatal {
			log.Fatal(err)
		}
	}
	delete(CacheList, *URL)
	// delete(OnMemory, *URL)
	save_cache_list()
}

func get_cache(URL *string) ([]byte, string, int, error) {
	response, err := http.Get(*URL)
	Time := time.Now()
	if err != nil {
		log.Printf("[ERROR] [cache][get_cache][http.Get] : %s\n", *URL)
		return nil, "", http.StatusInternalServerError, err
	} else {
		var Body []byte
		// if _, exists := OnMemory[*URL]; exists {
		// 	Body = OnMemory[*URL]
		if false {
		} else {
			Body, err = io.ReadAll(response.Body)
			if err != nil {
				log.Printf("[ERROR] [cache][get_cache][io.ReadAll]\n")
				return nil, "", http.StatusInternalServerError, err
			}
			// OnMemory[*URL] = Body
		}
		if len(Body) != 0 {
			if response.StatusCode == 200 {
				add_cache(URL, &Body, &Time, &response.Header.Values("Content-Type")[0])
			}
		}
		response.Body.Close()
		return Body, response.Header.Values("Content-Type")[0], response.StatusCode, err
	}
}

func cache_init() {
	err := load_cache_list()
	if err != nil {
		new_cache()
	}
}

func GetCache(r *gin.Engine) {
	router := r.Group("/cache")

	router.GET("/request", func(c *gin.Context) {
		URL := c.Query("url")
		msi, exists := CacheList[URL]
		if exists {
			block := msi.(map[string]interface{})
			file := cache_path + "/" + block["hash-url"].(string)
			ReadFile, err := os.ReadFile(file)
			if err != nil {
				log.Printf("[ERROR] [cache][GetCache][router.GET - /request][os.ReadFile] : %s\n", file)
				c.AbortWithStatus(http.StatusInternalServerError)
				return
			} else {
				c.Render(http.StatusOK, render.Data{
					ContentType: block["content-type"].(string),
					Data:        ReadFile,
				})
			}
		} else {
			_, err := url.ParseRequestURI(URL)
			if err != nil {
				log.Printf("[ERROR] [cache][GetCache][router.GET - /request][url.ParseRequestURI] : %s\n", URL)
				c.AbortWithStatus(http.StatusBadRequest)
				return
			} else {
				Body, ContentType, StatusCode, err := get_cache(&URL)
				if err != nil {
					c.AbortWithStatus(StatusCode)
					return
				} else {
					c.Render(StatusCode, render.Data{
						ContentType: ContentType,
						Data:        Body,
					})
				}
			}
		}
	})

	router.GET("/check", func(c *gin.Context) {
		url := c.Query("url")
		block, exists := CacheList[url]
		if exists {
			c.JSON(http.StatusOK, block)
		} else {
			c.JSON(http.StatusNotFound, gin.H{
				"message": "empty",
			})
		}
	})

	router.GET("/list", func(c *gin.Context) {
		c.JSON(http.StatusOK, CacheList)
	})

	router.DELETE("/remove", func(c *gin.Context) {
		url := c.Query("url")
		block, exists := CacheList[url]
		if exists {
			tmp := copy_map_string_interface(block)
			remove_cache(&url)
			c.JSON(http.StatusOK, tmp)
		} else {
			c.AbortWithStatus(http.StatusBadRequest)
		}
	})

	router.DELETE("/clear", func(c *gin.Context) {
		new_cache()
		c.AbortWithStatus(http.StatusAccepted)
	})
}

func RedirectToCacheServerForFontawesome(r *gin.Engine) {
	r.GET("/webfonts/:req", func(c *gin.Context) {
		URL := "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/webfonts/" + c.Param("req")
		c.Redirect(http.StatusFound, "/cache/request?url="+URL)
	})
}
