#!/bin/bash

echo "🧪 Testing Polyglot Shop API endpoints"

# Backend URL
BACKEND="http://localhost:8000"
PAYMENT="http://localhost:8080"
NOTIFICATION="http://localhost:8081"

echo ""
echo "1️⃣ Testing Backend (Django) endpoints..."

# Test products
echo "📦 GET /products/"
curl -s "$BACKEND/products/" | jq '.[0:2]' || curl -s "$BACKEND/products/"

echo ""
echo "📦 GET /products/1/"
curl -s "$BACKEND/products/1/" | jq '.' || curl -s "$BACKEND/products/1/"

echo ""
echo "🛒 POST /cart/add/"
curl -s -X POST "$BACKEND/cart/add/" \
  -H "Content-Type: application/json" \
  -d '{"product_id": 1, "quantity": 2}' | jq '.' || curl -s -X POST "$BACKEND/cart/add/" \
  -H "Content-Type: application/json" \
  -d '{"product_id": 1, "quantity": 2}'

echo ""
echo "🛒 GET /cart/1/"
curl -s "$BACKEND/cart/1/" | jq '.' || curl -s "$BACKEND/cart/1/"

echo ""
echo "2️⃣ Testing Payment Service (Go) endpoint..."

echo "💳 POST /checkout"
curl -s -X POST "$PAYMENT/checkout" \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1}' | jq '.' || curl -s -X POST "$PAYMENT/checkout" \
  -H "Content-Type: application/json" \
  -d '{"user_id": 1}'

echo ""
echo "3️⃣ Testing Notification Service (Spring Boot) endpoint..."

echo "📱 GET /health"
curl -s "$NOTIFICATION/health" | jq '.' || curl -s "$NOTIFICATION/health"

echo ""
echo "📱 POST /notify (test notification)"
curl -s -X POST "$NOTIFICATION/notify" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "order_id": 12345,
    "payment_id": "PAY-test",
    "products": [
      {
        "id": 1,
        "product": {
          "id": 1,
          "name": "Test Product",
          "description": "Test Description",
          "image_url": "https://example.com/image.jpg",
          "price": 99.99
        },
        "quantity": 1
      }
    ],
    "total": 99.99
  }' | jq '.' || curl -s -X POST "$NOTIFICATION/notify" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "order_id": 12345,
    "payment_id": "PAY-test",
    "products": [
      {
        "id": 1,
        "product": {
          "id": 1,
          "name": "Test Product",
          "description": "Test Description",
          "image_url": "https://example.com/image.jpg",
          "price": 99.99
        },
        "quantity": 1
      }
    ],
    "total": 99.99
  }'

echo ""
echo "✅ API testing complete!"
echo ""
echo "💡 Tips:"
echo "- Make sure all services are running"
echo "- Check service logs if any endpoints fail"
echo "- For Telegram notifications, configure TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID"
