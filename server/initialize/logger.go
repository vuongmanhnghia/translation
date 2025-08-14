package initialize

import (
	"server/global"

	"go.uber.org/zap"
)

func InitLogger() {
	logger, _ := zap.NewProduction()
	global.Logger = logger
}
