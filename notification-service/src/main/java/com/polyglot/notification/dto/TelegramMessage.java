package com.polyglot.notification.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class TelegramMessage {
    @JsonProperty("chat_id")
    private String chatId;
    
    private String text;

    // Constructors
    public TelegramMessage() {}

    public TelegramMessage(String chatId, String text) {
        this.chatId = chatId;
        this.text = text;
    }

    // Getters and Setters
    public String getChatId() {
        return chatId;
    }

    public void setChatId(String chatId) {
        this.chatId = chatId;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    @Override
    public String toString() {
        return "TelegramMessage{" +
                "chatId='" + chatId + '\'' +
                ", text='" + text + '\'' +
                '}';
    }
}
