package main

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

const listen string = "127.0.0.1:8000"

func main() {
	log.Println("app listening on", listen)

	StaticFS := gin.New()
	API := gin.New()
	StaticFS_Images := gin.New()

	sfs := StaticFS.Group("/")
	sfs.StaticFile("/", "./web/index.html")
	sfs.GET("/index.html", func(c *gin.Context) {
		c.Redirect(http.StatusFound, "/")
	})
	sfs.GET("/index", func(c *gin.Context) {
		c.Redirect(http.StatusFound, "/")
	})
	sfs.StaticFile("/index.css", "./web/index.css")
	sfs.StaticFile("/index.js", "./web/index.js")
	sfs.StaticFile("/font.css", "./web/font.css")
	sfs.StaticFile("/font.ttf", "./web/font.ttf")

	sfs_images := StaticFS_Images.Group("/images")
	sfs_images.Static("/", "./web/images")

	api := API.Group("/api")
	api.GET("/item-list", func(c *gin.Context) {
		content, err := ioutil.ReadFile("./web/list.json")
		if err != nil {
			log.Fatal(err)
		} else {
			var objmap []map[string]interface{}
			if err := json.Unmarshal(content, &objmap); err != nil {
				log.Fatal(err)
			}
			c.IndentedJSON(http.StatusOK, objmap)
		}
	})
	api.GET("/item-list-other", func(c *gin.Context) {
		content, err := ioutil.ReadFile("./api_cache.json")
		if err != nil {
			log.Fatal(err)
		} else {
			var objmap []map[string]interface{}
			if err := json.Unmarshal(content, &objmap); err != nil {
				log.Fatal(err)
			}
			c.IndentedJSON(http.StatusOK, objmap)
		}
	})
	api.GET("/url-item-list", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"url":     nil,
			"convert": true,
		})
	})

	r := gin.New()
	r.Use(func() gin.HandlerFunc {
		return func(c *gin.Context) {
			c.Writer.Header().Set("Cache-Control", "no-cache")
		}
	}())
	r.GET("/*any", func(c *gin.Context) {
		path := c.Param("any")
		if strings.HasPrefix(path, "/api") {
			API.HandleContext(c)
		} else if strings.HasPrefix(path, "/images") {
			StaticFS_Images.HandleContext(c)
		} else {
			StaticFS.HandleContext(c)
		}
	})

	r.Run(listen)
}
