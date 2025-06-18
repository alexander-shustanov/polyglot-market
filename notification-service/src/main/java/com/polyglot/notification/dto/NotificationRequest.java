package com.polyglot.notification.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.util.List;

public class NotificationRequest {
    @Email
    @NotBlank
    private String email;

    @JsonProperty("order_id")
    @NotNull
    @Positive
    private Integer orderId;

    @JsonProperty("payment_id")
    @NotBlank
    private String paymentId;

    @NotNull
    private List<CartItem> products;

    @NotNull
    @Positive
    private Double total;

    // Constructors
    public NotificationRequest() {}

    public NotificationRequest(String email, Integer orderId, String paymentId, List<CartItem> products, Double total) {
        this.email = email;
        this.orderId = orderId;
        this.paymentId = paymentId;
        this.products = products;
        this.total = total;
    }

    // Getters and Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }

    public String getPaymentId() {
        return paymentId;
    }

    public void setPaymentId(String paymentId) {
        this.paymentId = paymentId;
    }

    public List<CartItem> getProducts() {
        return products;
    }

    public void setProducts(List<CartItem> products) {
        this.products = products;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    @Override
    public String toString() {
        return "NotificationRequest{" +
                "email='" + email + '\'' +
                ", orderId=" + orderId +
                ", paymentId='" + paymentId + '\'' +
                ", products=" + products +
                ", total=" + total +
                '}';
    }
}
