#!/bin/bash

echo "🚀 Starting all services for Polyglot Shop"

# Function to run command in new terminal tab/window
run_in_new_terminal() {
    local command="$1"
    local title="$2"
    
    if command -v gnome-terminal &> /dev/null; then
        gnome-terminal --tab --title="$title" -- bash -c "$command; exec bash"
    elif command -v konsole &> /dev/null; then
        konsole --new-tab -e bash -c "$command; exec bash" &
    elif command -v xterm &> /dev/null; then
        xterm -title "$title" -e bash -c "$command; exec bash" &
    else
        echo "⚠️  No supported terminal found. Please run the following commands manually:"
        echo "Terminal: $title"
        echo "Command: $command"
        echo ""
        return 1
    fi
}

# Check if PostgreSQL is running
if ! docker ps | grep -q postgres; then
    echo "🐘 Starting PostgreSQL..."
    docker-compose up -d postgres
    sleep 5
fi

# Start Backend (Django)
echo "🐍 Starting Django backend..."
run_in_new_terminal "cd backend && source venv/bin/activate && python manage.py runserver" "Django Backend"

# Wait a bit
sleep 2

# Start Frontend (React)
echo "⚛️ Starting React frontend..."
run_in_new_terminal "cd frontend && npm run dev" "React Frontend"

# Wait a bit
sleep 2

# Start Payment Service (Go)
echo "🏦 Starting Go payment service..."
run_in_new_terminal "cd payment-service && go run main.go" "Go Payment Service"

# Wait a bit
sleep 2

# Start Notification Service (Spring Boot)
echo "📱 Starting Spring Boot notification service..."
run_in_new_terminal "cd notification-service && ./mvnw spring-boot:run" "Spring Boot Notifications"

echo ""
echo "✅ All services are starting!"
echo ""
echo "🔗 URLs:"
echo "- Frontend: http://localhost:5173"
echo "- Backend API: http://localhost:8000"
echo "- Payment Service: http://localhost:8080"
echo "- Notification Service: http://localhost:8081"
echo "- Django Admin: http://localhost:8000/admin"
echo ""
echo "⏳ Please wait a few moments for all services to fully start up."
echo "🔍 Check each terminal tab to see the status of each service."
