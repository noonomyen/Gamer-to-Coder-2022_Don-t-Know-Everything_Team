package main

import (
	"encoding/json"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func GetAPI(r *gin.Engine) {
	router := r.Group("/api")

	router.GET("/game-list", func(c *gin.Context) {
		ReadFile, err := os.ReadFile(Config.Api.Game_list)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{
				"request": c.Request.URL.Path,
				"message": "Server can't open json data file",
			})
		} else {
			var objmap []map[string]interface{}
			err := json.Unmarshal([]byte(ReadFile), &objmap)
			if err != nil {
				c.JSON(http.StatusInternalServerError, gin.H{
					"request": c.Request.URL.Path,
					"message": "Server can't read json data file",
				})
			} else {
				c.JSON(http.StatusOK, &objmap)
			}
		}
	})

	router.GET("/get-url", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"url":     nil,
			"convert": true,
		})
	})
}
