package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// Загружаем переменные окружения
	err := godotenv.Load()
	if err != nil {
		log.Println("Warning: .env file not found")
	}

	// Настройка Gin
	if os.Getenv("GIN_MODE") == "release" {
		gin.SetMode(gin.ReleaseMode)
	}

	r := gin.Default()

	// CORS middleware
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Health check
	r.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Checkout endpoint
	r.POST("/checkout", handleCheckout)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Payment service starting on port %s", port)
	log.Fatal(r.Run(":" + port))
}

func handleCheckout(c *gin.Context) {
	var req CheckoutRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(400, CheckoutResponse{
			Success: false,
			Message: "Invalid request format",
		})
		return
	}

	log.Printf("Processing checkout for user %d", req.UserID)

	// 1. Получаем данные корзины из Django
	backendURL := os.Getenv("BACKEND_URL")
	if backendURL == "" {
		backendURL = "http://localhost:8000"
	}

	cartURL := fmt.Sprintf("%s/cart/%d/", backendURL, req.UserID)
	resp, err := http.Get(cartURL)
	if err != nil {
		log.Printf("Error fetching cart: %v", err)
		c.JSON(500, CheckoutResponse{
			Success: false,
			Message: "Failed to fetch cart data",
		})
		return
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		log.Printf("Cart service returned status %d", resp.StatusCode)
		c.JSON(500, CheckoutResponse{
			Success: false,
			Message: "Cart service error",
		})
		return
	}

	var cart CartResponse
	if err := json.NewDecoder(resp.Body).Decode(&cart); err != nil {
		log.Printf("Error decoding cart response: %v", err)
		c.JSON(500, CheckoutResponse{
			Success: false,
			Message: "Invalid cart data",
		})
		return
	}

	if len(cart.Items) == 0 {
		c.JSON(400, CheckoutResponse{
			Success: false,
			Message: "Cart is empty",
		})
		return
	}

	// 2. Имитация обработки платежа
	log.Println("Processing payment...")
	time.Sleep(1 * time.Second) // Имитация времени обработки

	// 3. Генерация payment_id
	paymentID := fmt.Sprintf("PAY-%d", time.Now().Unix())
	orderID := int(time.Now().Unix()) // Простой ID заказа

	log.Printf("Payment processed successfully. Payment ID: %s", paymentID)

	total := cart.Total

	// 4. Отправка уведомления в Spring Boot
	notification := NotificationRequest{
		Email:     "test@example.com",
		OrderID:   orderID,
		PaymentID: paymentID,
		Products:  cart.Items,
		Total:     total,
	}

	if err := sendNotification(notification); err != nil {
		log.Printf("Failed to send notification: %v", err)
		// Не возвращаем ошибку, так как платеж уже обработан
	}

	c.JSON(200, CheckoutResponse{
		Success:   true,
		PaymentID: paymentID,
		Message:   "Payment processed successfully",
	})
}


func sendNotification(notification NotificationRequest) error {
	notificationURL := os.Getenv("NOTIFICATION_URL")
	if notificationURL == "" {
		notificationURL = "http://localhost:8081"
	}

	jsonData, err := json.Marshal(notification)
	if err != nil {
		return fmt.Errorf("failed to marshal notification: %v", err)
	}

	resp, err := http.Post(
		fmt.Sprintf("%s/notify", notificationURL),
		"application/json",
		bytes.NewBuffer(jsonData),
	)
	if err != nil {
		return fmt.Errorf("failed to send notification: %v", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return fmt.Errorf("notification service returned status %d", resp.StatusCode)
	}

	log.Println("Notification sent successfully")
	return nil
}
