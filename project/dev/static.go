package main

import (
	"log"

	"github.com/gin-contrib/static"
	"github.com/gin-gonic/gin"
)

func GetStatic(router *gin.Engine) {
	for _, i := range Config.Static {
		if i[0] == "static" {
			log.Printf("[static][GetStatic] add static path : %s -> %s\n", i[1], i[2])
			router.Use(static.Serve(i[1], static.LocalFile(i[2], false)))
		}
	}
}
