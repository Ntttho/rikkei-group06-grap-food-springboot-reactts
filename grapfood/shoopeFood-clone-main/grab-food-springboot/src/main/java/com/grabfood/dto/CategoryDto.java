package com.grabfood.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

public class CategoryDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CreateCategoryRequest {
        @NotNull(message = "restaurantId is required")
        private Integer restaurantId;

        @NotBlank(message = "name is required")
        private String name;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class UpdateCategoryRequest {
        private String name;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CategoryResponseDto {
        private Integer id;
        private Integer restaurantId;
        private String name;
        private List<FoodDto.FoodResponseDto> foods;
    }
}
