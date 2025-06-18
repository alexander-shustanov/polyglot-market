#!/bin/bash

echo "🚀 Setting up Polyglot Shop"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Start PostgreSQL
echo "🐘 Starting PostgreSQL..."
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 10

# Setup Backend (Django)
echo "🐍 Setting up Django backend..."
cd backend
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install -r requirements.txt

# Run Django migrations
echo "📦 Running Django migrations..."
python manage.py migrate

# Load initial data
echo "📝 Loading initial product data..."
python manage.py loaddata fixtures/initial_data.json

# Create superuser (optional)
echo "👤 Creating Django superuser (optional)..."
echo "You can skip this by pressing Ctrl+C"
python manage.py createsuperuser --noinput --username admin --email admin@example.com || true

cd ..

# Setup Frontend (React)
echo "⚛️ Setting up React frontend..."
cd frontend
npm install
cd ..

# Setup Payment Service (Go)
echo "🏦 Setting up Go payment service..."
cd payment-service
go mod tidy
cd ..

# Setup Notification Service (Spring Boot)
echo "📱 Setting up Spring Boot notification service..."
cd notification-service
chmod +x mvnw
./mvnw dependency:resolve
cd ..

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Start the backend: cd backend && source venv/bin/activate && python manage.py runserver"
echo "2. Start the frontend: cd frontend && npm run dev"
echo "3. Start the payment service: cd payment-service && go run main.go"
echo "4. Start the notification service: cd notification-service && ./mvnw spring-boot:run"
echo ""
echo "🔗 URLs:"
echo "- Frontend: http://localhost:5173"
echo "- Backend API: http://localhost:8000"
echo "- Payment Service: http://localhost:8080"
echo "- Notification Service: http://localhost:8081"
echo "- Django Admin: http://localhost:8000/admin"
