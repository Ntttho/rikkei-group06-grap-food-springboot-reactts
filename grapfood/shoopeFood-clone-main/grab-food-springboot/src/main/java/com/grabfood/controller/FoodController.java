package com.grabfood.controller;

import com.grabfood.dto.ApiResponse;
import com.grabfood.dto.FoodDto.*;
import com.grabfood.security.CustomUserDetails;
import com.grabfood.service.FoodService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/foods")
@RequiredArgsConstructor
public class FoodController {

    private final FoodService foodService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<FoodResponseDto>>> getAllFoods(
        @RequestParam(required = false) Integer categoryId,
        @RequestParam(required = false) Integer restaurantId
    ) {
        return ResponseEntity.ok(ApiResponse.success(foodService.getAllFoods(categoryId, restaurantId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<FoodResponseDto>> getFoodById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(foodService.getFoodById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('MERCHANT', 'ADMIN')")
    public ResponseEntity<ApiResponse<FoodResponseDto>> createFood(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @Valid @RequestBody CreateFoodRequest req
    ) {
        return ResponseEntity.ok(ApiResponse.success(foodService.createFood(userDetails.getUser(), req)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('MERCHANT', 'ADMIN')")
    public ResponseEntity<ApiResponse<FoodResponseDto>> updateFood(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Integer id,
        @RequestBody UpdateFoodRequest req
    ) {
        return ResponseEntity.ok(ApiResponse.success(foodService.updateFood(userDetails.getUser(), id, req)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('MERCHANT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteFood(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Integer id
    ) {
        foodService.deleteFood(userDetails.getUser(), id);
        return ResponseEntity.ok(ApiResponse.message("Food deleted"));
    }
}
