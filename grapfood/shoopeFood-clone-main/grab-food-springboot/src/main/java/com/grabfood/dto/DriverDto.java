package com.grabfood.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DriverDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateLocationRequest {
        @NotNull(message = "latitude is required")
        private Double latitude;

        @NotNull(message = "longitude is required")
        private Double longitude;

        private Double heading;
        private Double speedKmh;
        private Long orderId;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class OnlineStatusRequest {
        private Boolean isOnline;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DriverProfileDto {
        private Integer id;
        private String fullName;
        private String phone;
        private String licensePlate;
        private String vehicleType;
        private String idCardNumber;
        private String approvalStatus;
        private Boolean isOnline;
        private BigDecimal ratingAvg;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DriverLocationDto {
        private Long id;
        private Integer driverId;
        private Long orderId;
        private Double latitude;
        private Double longitude;
        private Double heading;
        private Double speedKmh;
        private LocalDateTime createdAt;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PerformanceMetricsDto {
        private Integer totalOrders;
        private Integer completedOrders;
        private Integer cancelledOrders;
        private Double completionRate;
        private BigDecimal totalEarnings;
        private BigDecimal ratingAvg;
    }
}
