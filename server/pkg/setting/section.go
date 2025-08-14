package setting

type Config struct {
	Server Server `mapstructure:"server"`
	DeepL  string `mapstructure:"deepl_api_key"`
}

type Server struct {
	Mode string `mapstructure:"mode"`
	Port string `mapstructure:"port"`
}
