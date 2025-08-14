package main

import (
	"server/global"
	"server/initialize"
)

func main() {
	initialize.InitLogger()
	initialize.LoadConfig()

	router := initialize.InitRouter()
	router.Run(":" + global.Config.Server.Port)
	// router.RunTLS(":"+global.Config.Server.Port, "cert.pem", "key.pem")

}
