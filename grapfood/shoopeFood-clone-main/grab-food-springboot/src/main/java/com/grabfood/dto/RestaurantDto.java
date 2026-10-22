package com.grabfood.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.List;

public class RestaurantDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateRestaurantRequest {
        @NotBlank(message = "name is required")
        private String name;

        private String address;

        @NotNull(message = "latitude is required")
        private Double latitude;

        @NotNull(message = "longitude is required")
        private Double longitude;

        private LocalTime openingTime;
        private LocalTime closingTime;
        private String imageUrl;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateRestaurantRequest {
        private String name;
        private String address;
        private Double latitude;
        private Double longitude;
        private LocalTime openingTime;
        private LocalTime closingTime;
        private String imageUrl;
        private Boolean isOpen;
        private Boolean isOpenToday;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PatchStatusRequest {
        private Boolean isOpen;
        private Boolean isOpenToday;
        private String temporaryClosedReason;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PatchLocationRequest {
        @NotNull(message = "latitude is required")
        private Double latitude;

        @NotNull(message = "longitude is required")
        private Double longitude;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RejectRequest {
        private String reason;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RestaurantResponseDto {
        private Integer id;
        private Integer ownerId;
        private String ownerName;
        private String name;
        private String address;
        private Double latitude;
        private Double longitude;
        private LocalTime openingTime;
        private LocalTime closingTime;
        private Boolean isOpen;
        private Boolean isOpenToday;
        private String temporaryClosedReason;
        private String imageUrl;
        private BigDecimal ratingAvg;
        private String approvalStatus;
        private List<CategoryDto.CategoryResponseDto> categories;
    }
}
