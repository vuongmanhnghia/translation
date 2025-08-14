package initialize

import (
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"server/global"
	"strings"

	"github.com/gin-gonic/gin"
)

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Credentials", "true")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Header("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func InitRouter() *gin.Engine {
	router := gin.Default()

	// Add CORS middleware
	router.Use(CORSMiddleware())

	// Add logging middleware để debug
	router.Use(gin.LoggerWithFormatter(func(param gin.LogFormatterParams) string {
		return fmt.Sprintf("[%s] %s %s %d %s\n",
			param.TimeStamp.Format("2006/01/02 - 15:04:05"),
			param.Method,
			param.Path,
			param.StatusCode,
			param.Latency,
		)
	}))

	router.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "pong",
			"headers": c.Request.Header,
			"host":    c.Request.Host,
			"proto":   c.Request.Proto,
		})
	})

	router.POST("/translate", func(c *gin.Context) {
		// Struct có thể nhận cả string và array
		var requestData struct {
			Text       interface{} `json:"text"` // Dùng interface{} để flexible
			TargetLang string      `json:"target_lang"`
			SourceLang string      `json:"source_lang,omitempty"`
		}

		if err := c.ShouldBindJSON(&requestData); err != nil {
			c.JSON(400, gin.H{
				"error": "Invalid JSON: " + err.Error(),
			})
			return
		}

		// Parse text field
		var textToTranslate string
		switch v := requestData.Text.(type) {
		case string:
			textToTranslate = v
		case []interface{}:
			// Nếu là array, join các phần tử
			var texts []string
			for _, item := range v {
				if str, ok := item.(string); ok {
					texts = append(texts, str)
				}
			}
			textToTranslate = strings.Join(texts, " ")
		case []string:
			textToTranslate = strings.Join(v, " ")
		default:
			c.JSON(400, gin.H{
				"error": "Text field must be string or array of strings",
			})
			return
		}

		// DEBUG: Log parsed data
		fmt.Printf("=== Parsed Request Data ===\n")
		fmt.Printf("Original Text field type: %T\n", requestData.Text)
		fmt.Printf("Original Text field value: %+v\n", requestData.Text)
		fmt.Printf("Processed Text: '%s' (length: %d)\n", textToTranslate, len(textToTranslate))
		fmt.Printf("TargetLang: '%s'\n", requestData.TargetLang)

		// Validate
		if strings.TrimSpace(textToTranslate) == "" {
			c.JSON(400, gin.H{
				"error": "Text field is required and cannot be empty",
			})
			return
		}

		if strings.TrimSpace(requestData.TargetLang) == "" {
			c.JSON(400, gin.H{
				"error": "target_lang field is required",
			})
			return
		}

		// Tạo form data cho DeepL API
		formData := url.Values{}
		formData.Set("text", strings.TrimSpace(textToTranslate))
		formData.Set("target_lang", strings.TrimSpace(requestData.TargetLang))
		if requestData.SourceLang != "" {
			formData.Set("source_lang", strings.TrimSpace(requestData.SourceLang))
		}

		fmt.Printf("Form data to DeepL: %s\n", formData.Encode())

		// Rest of the code remains the same...
		req, err := http.NewRequest("POST", "https://api-free.deepl.com/v2/translate",
			strings.NewReader(formData.Encode()))
		if err != nil {
			c.JSON(500, gin.H{
				"error": err.Error(),
			})
			return
		}

		req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
		req.Header.Set("Authorization", "DeepL-Auth-Key "+global.Config.DeepL)

		client := &http.Client{}
		response, err := client.Do(req)
		if err != nil {
			c.JSON(500, gin.H{
				"error": err.Error(),
			})
			return
		}
		defer response.Body.Close()

		body, err := io.ReadAll(response.Body)
		if err != nil {
			c.JSON(500, gin.H{
				"error": err.Error(),
			})
			return
		}

		fmt.Printf("DeepL response (status %d): %s\n", response.StatusCode, string(body))

		if response.StatusCode != 200 {
			c.JSON(response.StatusCode, gin.H{
				"error":   "DeepL API error",
				"details": string(body),
				"status":  response.StatusCode,
			})
			return
		}

		var responseData map[string]interface{}
		err = json.Unmarshal(body, &responseData)
		if err != nil {
			c.JSON(500, gin.H{
				"error": "Failed to parse response: " + err.Error(),
			})
			return
		}

		c.JSON(200, responseData)
	})

	return router
}
