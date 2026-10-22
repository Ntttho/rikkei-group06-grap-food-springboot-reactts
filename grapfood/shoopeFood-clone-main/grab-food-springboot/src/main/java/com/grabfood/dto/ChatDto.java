package com.grabfood.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDateTime;

public class ChatDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SendMessageRequest {
        @NotNull(message = "shopId is required")
        private Integer shopId;

        private Integer orderId;

        @NotBlank(message = "message cannot be blank")
        private String message;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ChatMessageResponse {
        private Integer id;
        private Integer senderId;
        private String senderName;
        private Integer shopId;
        private String shopName;
        private Integer orderId;
        private String message;
        private String senderRole;
        private Boolean isRead;
        private LocalDateTime createdAt;
    }
}
