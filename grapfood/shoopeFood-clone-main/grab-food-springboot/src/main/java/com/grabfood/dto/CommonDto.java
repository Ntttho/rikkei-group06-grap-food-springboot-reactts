package com.grabfood.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CommonDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ValidateVoucherRequest {
        @NotBlank(message = "code is required")
        private String code;
        private BigDecimal orderAmount;
        private Integer restaurantId;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateVoucherRequest {
        @NotBlank(message = "code is required")
        private String code;
        @NotNull(message = "discountAmount is required")
        private BigDecimal discountAmount;
        private BigDecimal minOrderValue;
        private LocalDateTime expiryDate;
        private Boolean isActive;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateSettingRequest {
        @NotBlank(message = "configKey is required")
        private String configKey;
        @NotBlank(message = "configValue is required")
        private String configValue;
        private String description;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateReviewRequest {
        @NotNull(message = "orderId is required")
        private Long orderId;
        @NotBlank(message = "targetType is required")
        private String targetType;
        @NotNull(message = "targetId is required")
        private Integer targetId;
        private Integer rating;
        private String comment;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateAddressRequest {
        @NotBlank(message = "address is required")
        private String address;
        private Double latitude;
        private Double longitude;
        private Boolean isDefault;
        private String label;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class DriverApplicationRequest {
        private String licensePlate;
        private String vehicleType;
        private String idCardNumber;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MerchantApplicationRequest {
        private String businessLicense;
        private String taxCode;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PaymentCallbackRequest {
        private Long orderId;
        private String transactionRef;
        private String status;
        private String gatewayResponse;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreatePaymentRequest {
        @NotNull(message = "orderId is required")
        private Long orderId;
        private String paymentMethod;
        private BigDecimal amount;
        private String idempotencyKey;
    }
}
