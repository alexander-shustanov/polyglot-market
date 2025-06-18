# Быстрый старт Polyglot Shop

## Предварительные требования

- **Python 3.8+** с pip
- **Node.js 18+** с npm
- **Go 1.21+**
- **Java 17+**
- **Docker** и **Docker Compose**
- **PostgreSQL** (будет запущен через Docker)

## Автоматическая установка

```bash
# Делаем скрипты исполняемыми
chmod +x scripts/*.sh

# Запускаем автоматическую установку
./scripts/setup.sh

# Запускаем все сервисы одновременно
./scripts/start-all.sh
```

## Ручная установка

### 1. База данных

```bash
# Запускаем PostgreSQL через Docker
docker-compose up -d postgres
```

### 2. Backend (Django)

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # или `venv\Scripts\activate` на Windows
pip install -r requirements.txt

# Настройка базы данных
python manage.py migrate
python manage.py loaddata fixtures/initial_data.json

# Создание суперпользователя (опционально)
python manage.py createsuperuser

# Запуск
python manage.py runserver
```

### 3. Frontend (React)

```bash
cd frontend
npm install
npm run dev
```

### 4. Payment Service (Go)

```bash
cd payment-service
go mod tidy
go run main.go
```

### 5. Notification Service (Spring Boot)

```bash
cd notification-service
chmod +x mvnw
./mvnw spring-boot:run
```

## Настройка Telegram (опционально)

1. Создайте бота через [@BotFather](https://t.me/botfather)
2. Получите токен бота
3. Найдите ваш chat_id (отправьте сообщение боту, затем перейдите по ссылке: `https://api.telegram.org/bot<TOKEN>/getUpdates`)
4. Настройте переменные окружения:

```bash
# В notification-service/src/main/resources/application.properties
telegram.bot.token=YOUR_BOT_TOKEN
telegram.bot.chat-id=YOUR_CHAT_ID
```

## Тестирование

```bash
# Тестирование API
./scripts/test-api.sh

# Или вручную
curl http://localhost:8000/products/
curl http://localhost:8000/cart/1/
curl -X POST http://localhost:8080/checkout -H "Content-Type: application/json" -d '{"user_id":1}'
```

## URLs сервисов

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:8000
- **Payment Service**: http://localhost:8080
- **Notification Service**: http://localhost:8081
- **Django Admin**: http://localhost:8000/admin

## Демо-flow

1. Откройте http://localhost:5173
2. Просмотрите товары на странице `/products`
3. Добавьте товары в корзину
4. Перейдите в корзину `/cart`
5. Нажмите "Checkout"
6. Проверьте логи всех сервисов
7. Если настроен Telegram, получите уведомление

## Структура проекта

```
project-root/
├── frontend/              # React + TypeScript (порт 5173)
├── backend/               # Django + PostgreSQL (порт 8000)
├── payment-service/       # Go (порт 8080)
├── notification-service/  # Spring Boot (порт 8081)
├── scripts/              # Скрипты для автоматизации
└── docker-compose.yml    # PostgreSQL
```

## Troubleshooting

**Ошибка подключения к базе данных:**
```bash
docker-compose up -d postgres
# Подождите 10 секунд перед запуском Django
```

**Ошибки CORS:**
- Убедитесь, что все сервисы запущены на правильных портах
- Проверьте настройки CORS в Django settings.py

**Go модули:**
```bash
cd payment-service
go mod tidy
go clean -modcache  # если нужно
```

**Java/Maven:**
```bash
cd notification-service
./mvnw clean install
```

**Порты заняты:**
- Измените порты в конфигурационных файлах
- Или остановите конфликтующие процессы
