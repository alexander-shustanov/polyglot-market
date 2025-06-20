package main

type CheckoutRequest struct {
	UserID int `json:"user_id"`
    Promo string `json:"promo"`
}

type CartResponse struct {
	Items []CartItem `json:"items"`
	Total float64    `json:"total"`
}

type CartItem struct {
	ID       int     `json:"id"`
	Product  Product `json:"product"`
	Quantity int     `json:"quantity"`
}

type Product struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	ImageURL    string  `json:"image_url"`
	Price       float64 `json:"price"`
}

type NotificationRequest struct {
	Email     string     `json:"email"`
	OrderID   int        `json:"order_id"`
	PaymentID string     `json:"payment_id"`
	Products  []CartItem `json:"products"`
	Total     float64    `json:"total"`
}

type CheckoutResponse struct {
	Success   bool   `json:"success"`
	PaymentID string `json:"payment_id,omitempty"`
	Message   string `json:"message,omitempty"`
}