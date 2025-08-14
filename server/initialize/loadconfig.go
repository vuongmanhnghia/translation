package initialize

import (
	"fmt"
	"os"
	"server/global"

	"github.com/joho/godotenv"
	"github.com/spf13/viper"
)

func LoadConfig() {
	// Load .env file if it exists
	godotenv.Load()

	mode := os.Getenv("MODE")
	if mode == "" {
		mode = "local"
	}
	fmt.Println("----- Mode ----- : ", mode)

	viper := viper.New()
	viper.AddConfigPath("./configs")
	viper.SetConfigName(mode)
	viper.SetConfigType("yaml")

	err := viper.ReadInConfig()
	if err != nil {
		panic(fmt.Errorf("failed to unmarshal config: %w", err))
	}

	err = viper.Unmarshal(&global.Config)
	if err != nil {
		panic(fmt.Errorf("failed to unmarshal config: %w", err))
	}
}
