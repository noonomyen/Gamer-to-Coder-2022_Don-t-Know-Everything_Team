package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"runtime"
	"runtime/debug"

	"github.com/gin-gonic/gin"

	"net/http"
	_ "net/http/pprof"
)

var Config struct {
	Listen   string `json:"listen"`
	ReqLimit struct {
		Enable bool `json:"enable"`
		Limit  int  `json:"limit"`
	} `json:"request-limit"`
	Dev struct {
		GinDebug          bool   `json:"debug.gin"`
		PPROF             bool   `json:"debug.pprof"`
		GC                bool   `json:"debug.gc"`
		GC_Percent        int    `json:"debug.gc.percent"`
		GOMAXPROCS        int    `json:"runtime.gcmaxprocs"`
		PPROF_Listen      string `json:"debug.pprof.listen"`
		RequestLog        bool   `json:"debug.request-log"`
		RequestLogCounter bool   `json:"debug.request-log.counter"`
		Debug_Fatal       bool   `json:"debug.fatal"`
		PresetCCNS        bool   `json:"preset-cache-control-no-store"`
	} `json:"dev"`
	Api struct {
		Game_list string `json:"game-list"`
	} `json:"api"`
	Static [][]string `json:"static"`
}

func main() {
	ReadFile, err := os.ReadFile("./config.json")
	if err != nil {
		fmt.Print("\nCan't open config file.\n\n")
		log.Fatal(err)
	}
	err = json.Unmarshal([]byte(ReadFile), &Config)
	if err != nil {
		fmt.Print("\nCan't read config file.\n\n")
		log.Fatal(err)
	}

	if Config.Dev.GOMAXPROCS != 0 {
		runtime.GOMAXPROCS(Config.Dev.GOMAXPROCS)
	}
	if Config.Dev.GC {
		debug.SetGCPercent(Config.Dev.GC_Percent)
	}
	if Config.Dev.PPROF {
		log.Printf("[main][main] pprof is enable, listening at : %s", Config.Dev.PPROF_Listen)
		go func() {
			log.Println(http.ListenAndServe(Config.Dev.PPROF_Listen, nil))
		}()
	}
	if Config.Dev.GinDebug {
		gin.SetMode(gin.DebugMode)
	} else {
		gin.SetMode(gin.ReleaseMode)
	}

	cache_init()
	router := gin.New()

	if Config.Dev.RequestLog {
		log.Println("[main][main] add middleware : RequestLog")
		log.Printf("[main][main] add middleware request counter enable : %t\n", Config.Dev.RequestLogCounter)
		if Config.Dev.RequestLogCounter {
			var DEV_request_counter uint = 0
			router.Use(func(c *gin.Context) {
				DEV_request_counter += 1
				log.Printf("[middleware][RequestLog] | [%d] %s %s - %s", DEV_request_counter, c.Request.RemoteAddr, c.Request.Method, c.Request.URL.Path)
				c.Next()
			})
		} else {
			router.Use(func(c *gin.Context) {
				log.Printf("[middleware][RequestLog] | %s %s - %s", c.Request.RemoteAddr, c.Request.Method, c.Request.URL.Path)
				c.Next()
			})
		}
	}

	if Config.ReqLimit.Enable {
		semaphore := make(chan bool, Config.ReqLimit.Limit)
		router.Use(func(c *gin.Context) {
			semaphore <- true
			c.Next()
			<-semaphore
		})
	}

	if Config.Dev.PresetCCNS {
		router.Use(func() gin.HandlerFunc {
			return func(c *gin.Context) {
				c.Writer.Header().Set("Cache-Control", "no-store")
			}
		}())
	}

	GetAPI(router)
	GetCache(router)
	GetStatic(router)

	log.Println("[main][main] Server listening at", Config.Listen)
	router.Run(Config.Listen)
}
