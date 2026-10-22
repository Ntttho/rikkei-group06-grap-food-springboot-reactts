package com.grabfood.controller;

import com.grabfood.dto.ApiResponse;
import com.grabfood.dto.ToppingDto.*;
import com.grabfood.security.CustomUserDetails;
import com.grabfood.service.ToppingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ToppingController {

    private final ToppingService toppingService;

    @GetMapping("/restaurants/{id}/toppings")
    public ResponseEntity<ApiResponse<List<ToppingResponseDto>>> listByRestaurant(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(toppingService.listByRestaurant(id)));
    }

    @PostMapping("/restaurants/{id}/toppings")
    @PreAuthorize("hasAnyRole('MERCHANT', 'ADMIN')")
    public ResponseEntity<ApiResponse<ToppingResponseDto>> createTopping(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Integer id,
        @Valid @RequestBody CreateToppingRequest req
    ) {
        return ResponseEntity.ok(ApiResponse.success(toppingService.createTopping(userDetails.getUser(), id, req)));
    }

    @PutMapping("/toppings/{id}")
    @PreAuthorize("hasAnyRole('MERCHANT', 'ADMIN')")
    public ResponseEntity<ApiResponse<ToppingResponseDto>> updateTopping(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Integer id,
        @RequestBody UpdateToppingRequest req
    ) {
        return ResponseEntity.ok(ApiResponse.success(toppingService.updateTopping(userDetails.getUser(), id, req)));
    }

    @DeleteMapping("/toppings/{id}")
    @PreAuthorize("hasAnyRole('MERCHANT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteTopping(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Integer id
    ) {
        toppingService.deleteTopping(userDetails.getUser(), id);
        return ResponseEntity.ok(ApiResponse.message("Topping deleted"));
    }

    @GetMapping("/foods/{id}/toppings")
    public ResponseEntity<ApiResponse<List<ToppingResponseDto>>> listByFood(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(toppingService.listByFood(id)));
    }

    @PostMapping("/foods/{id}/toppings")
    @PreAuthorize("hasAnyRole('MERCHANT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> assignToFood(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Integer id,
        @Valid @RequestBody AssignToFoodRequest req
    ) {
        toppingService.assignToFood(userDetails.getUser(), id, req);
        return ResponseEntity.ok(ApiResponse.message("Topping assigned to food"));
    }
}
