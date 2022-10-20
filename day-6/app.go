package main

import (
	"log"
	"net/http"
)

const listen string = "127.0.0.1:8000"

func main() {
	http.Handle("/", http.FileServer(http.Dir("./web")))

	log.Println("app listening on", listen)
	err := http.ListenAndServe(listen, nil)
	if err != nil {
		log.Fatal(err)
	}
}
