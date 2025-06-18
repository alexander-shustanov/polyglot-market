package com.polyglot.notification.controller;

import com.polyglot.notification.dto.NotificationRequest;
import com.polyglot.notification.service.NotificationService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@CrossOrigin(origins = "*")
public class NotificationController {
    private static final Logger logger = LoggerFactory.getLogger(NotificationController.class);

    @Autowired
    private NotificationService notificationService;

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "ok", "service", "notification-service"));
    }

    @PostMapping("/notify")
    public ResponseEntity<Map<String, Object>> notify(@Valid @RequestBody NotificationRequest request) {
        logger.info("Received notification request for order #{}", request.getOrderId());
        
        try {
            boolean success = notificationService.processNotification(request);
            
            if (success) {
                return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Notification sent successfully",
                    "order_id", request.getOrderId()
                ));
            } else {
                return ResponseEntity.status(500).body(Map.of(
                    "success", false,
                    "message", "Failed to send notification",
                    "order_id", request.getOrderId()
                ));
            }
        } catch (Exception e) {
            logger.error("Error processing notification", e);
            return ResponseEntity.status(500).body(Map.of(
                "success", false,
                "message", "Internal server error: " + e.getMessage(),
                "order_id", request.getOrderId()
            ));
        }
    }
}
