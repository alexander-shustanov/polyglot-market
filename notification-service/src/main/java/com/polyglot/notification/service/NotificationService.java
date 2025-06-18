package com.polyglot.notification.service;

import com.polyglot.notification.dto.CartItem;
import com.polyglot.notification.dto.NotificationRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {
    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    @Autowired
    private TelegramService telegramService;

    public boolean processNotification(NotificationRequest request) {
        logger.info("Processing notification for order #{}", request.getOrderId());

        // Формируем сообщение
        String message = formatOrderMessage(request);
        
        // Отправляем в Telegram
        boolean success = telegramService.sendMessage(message);
        
        if (success) {
            logger.info("Notification sent successfully for order #{}", request.getOrderId());
        } else {
            logger.error("Failed to send notification for order #{}", request.getOrderId());
        }
        
        return success;
    }

    private String formatOrderMessage(NotificationRequest request) {
        StringBuilder message = new StringBuilder();
        
        message.append("🛍 Новый заказ #").append(request.getOrderId()).append("\n");
        message.append("📧 Email: ").append(request.getEmail()).append("\n");
        message.append("💳 Оплата: ").append(request.getPaymentId()).append("\n");
        message.append("💰 Сумма: $").append(String.format("%.2f", request.getTotal())).append("\n\n");
        
        message.append("📦 Товары:\n");
        for (CartItem item : request.getProducts()) {
            message.append("• ").append(item.getProduct().getName())
                   .append(" x").append(item.getQuantity())
                   .append(" ($").append(String.format("%.2f", item.getProduct().getPrice())).append(")\n");
        }
        
        return message.toString();
    }
}
