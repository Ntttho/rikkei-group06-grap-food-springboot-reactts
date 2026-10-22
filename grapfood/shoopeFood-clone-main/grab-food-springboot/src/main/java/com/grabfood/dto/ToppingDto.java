package com.grabfood.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;

public class ToppingDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateToppingRequest {
        @NotBlank(message = "name is required")
        private String name;

        @NotNull(message = "price is required")
        private BigDecimal price;

        private Boolean isAvailable;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateToppingRequest {
        private String name;
        private BigDecimal price;
        private Boolean isAvailable;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AssignToFoodRequest {
        @NotNull(message = "toppingId is required")
        private Integer toppingId;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ToppingResponseDto {
        private Integer id;
        private Integer restaurantId;
        private String name;
        private BigDecimal price;
        private Boolean isAvailable;
    }
}
