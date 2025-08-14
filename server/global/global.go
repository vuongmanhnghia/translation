package global

import (
	"server/pkg/setting"

	"go.uber.org/zap"
)

var (
	Logger *zap.Logger
	Config *setting.Config
)
