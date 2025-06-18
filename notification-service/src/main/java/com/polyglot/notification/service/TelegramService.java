package com.polyglot.notification.service;

import com.polyglot.notification.config.TelegramConfig;
import com.polyglot.notification.dto.TelegramMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class TelegramService {
    private static final Logger logger = LoggerFactory.getLogger(TelegramService.class);
    private static final String TELEGRAM_API_URL = "https://api.telegram.org/bot";

    @Autowired
    private TelegramConfig telegramConfig;

    private final RestTemplate restTemplate = new RestTemplate();

    public boolean sendMessage(String message) {
        try {
            String token = telegramConfig.getToken();
            String chatId = telegramConfig.getChatId();

            if (token == null || token.trim().isEmpty() || 
                chatId == null || chatId.trim().isEmpty()) {
                logger.warn("Telegram bot token or chat ID not configured. Message not sent.");
                logger.info("Would send message: {}", message);
                return false;
            }

            String url = TELEGRAM_API_URL + token + "/sendMessage";
            TelegramMessage telegramMessage = new TelegramMessage(chatId, message);

            logger.info("Sending message to Telegram: {}", message);
            ResponseEntity<String> response = restTemplate.postForEntity(url, telegramMessage, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                logger.info("Message sent successfully to Telegram");
                return true;
            } else {
                logger.error("Failed to send message to Telegram. Status: {}", response.getStatusCode());
                return false;
            }
        } catch (Exception e) {
            logger.error("Error sending message to Telegram", e);
            return false;
        }
    }
}
