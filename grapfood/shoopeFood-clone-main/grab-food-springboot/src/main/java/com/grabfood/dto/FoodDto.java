package com.grabfood.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

public class FoodDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateFoodRequest {
        @NotNull(message = "categoryId is required")
        private Integer categoryId;

        @NotBlank(message = "name is required")
        private String name;

        @NotNull(message = "price is required")
        private BigDecimal price;

        private Integer defaultQuantity;
        private Integer currentQuantity;
        private Boolean isAvailable;
        private String imageUrl;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateFoodRequest {
        private Integer categoryId;
        private String name;
        private BigDecimal price;
        private Integer defaultQuantity;
        private Integer currentQuantity;
        private Boolean isAvailable;
        private String imageUrl;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FoodResponseDto {
        private Integer id;
        private Integer categoryId;
        private String categoryName;
        private String name;
        private BigDecimal price;
        private Boolean isAvailable;
        private Integer defaultQuantity;
        private Integer currentQuantity;
        private String imageUrl;
        private List<ToppingDto.ToppingResponseDto> toppings;
    }
}
