package com.grabfood.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateOrderRequest {
        @NotNull(message = "restaurantId is required")
        private Integer restaurantId;

        private Integer voucherId;
        private String receiverAddress;

        @NotNull(message = "receiverLat is required")
        private Double receiverLat;

        @NotNull(message = "receiverLng is required")
        private Double receiverLng;

        private Double distanceKm;
        private BigDecimal baseFee;
        private BigDecimal discountAmount;
        private BigDecimal taxAmount;
        private String shippingType;
        private String orderCode;
        private String idempotencyKey;

        private List<OrderItemRequest> items;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItemRequest {
        @NotNull(message = "foodId is required")
        private Integer foodId;

        @NotNull(message = "quantity is required")
        private Integer quantity;

        private List<ToppingItemRequest> toppings;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ToppingItemRequest {
        @NotNull(message = "id is required")
        private Integer id;

        @NotNull(message = "quantity is required")
        private Integer quantity;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateOrderStatusRequest {
        private String statusCode;
        private String status;
        private String reason;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RejectOrderRequest {
        private String reason;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CancelOrderRequest {
        private String reason;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderResponseDto {
        private Long id;
        private String orderCode;
        private String idempotencyKey;
        private Integer customerId;
        private String customerName;
        private String customerPhone;
        private Integer restaurantId;
        private String restaurantName;
        private Integer driverId;
        private String driverName;
        private String driverPhone;
        private Integer voucherId;
        private String receiverAddress;
        private Double receiverLat;
        private Double receiverLng;
        private Double distanceKm;
        private BigDecimal subtotalAmount;
        private BigDecimal taxAmount;
        private BigDecimal shippingFee;
        private BigDecimal discountAmount;
        private BigDecimal totalAmount;
        private String statusCode;
        private String statusLabel;
        private Integer version;
        private String cancelReason;
        private LocalDateTime createdAt;
        private List<OrderItemResponseDto> items;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItemResponseDto {
        private Long id;
        private Integer foodId;
        private String foodName;
        private Integer quantity;
        private BigDecimal priceAtOrder;
        private List<OrderItemToppingResponseDto> toppings;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class OrderItemToppingResponseDto {
        private Long id;
        private Integer toppingId;
        private String toppingName;
        private Integer quantity;
        private BigDecimal price;
    }
}
