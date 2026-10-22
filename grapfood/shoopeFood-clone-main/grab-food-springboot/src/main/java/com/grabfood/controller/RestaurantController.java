package com.grabfood.controller;

import com.grabfood.dto.ApiResponse;
import com.grabfood.dto.RestaurantDto.*;
import com.grabfood.entity.RestaurantChangeRequest;
import com.grabfood.security.CustomUserDetails;
import com.grabfood.service.RestaurantService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/restaurants")
@RequiredArgsConstructor
public class RestaurantController {

    private final RestaurantService restaurantService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<RestaurantResponseDto>>> listRestaurants() {
        return ResponseEntity.ok(ApiResponse.success(restaurantService.listPublicRestaurants()));
    }

    @GetMapping("/mine")
    @PreAuthorize("hasAnyRole('MERCHANT', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<RestaurantResponseDto>>> listMyRestaurants(
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.success(restaurantService.listMyRestaurants(userDetails.getUser())));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('MERCHANT', 'ADMIN')")
    public ResponseEntity<ApiResponse<RestaurantResponseDto>> createRestaurant(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @Valid @RequestBody CreateRestaurantRequest req
    ) {
        return ResponseEntity.ok(ApiResponse.success(restaurantService.createRestaurant(userDetails.getUser(), req)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<RestaurantResponseDto>> getRestaurantById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(restaurantService.getRestaurantById(id)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('MERCHANT', 'ADMIN')")
    public ResponseEntity<ApiResponse<RestaurantResponseDto>> updateRestaurant(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Integer id,
        @RequestBody UpdateRestaurantRequest req
    ) {
        return ResponseEntity.ok(ApiResponse.success(restaurantService.updateRestaurant(userDetails.getUser(), id, req)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('MERCHANT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteRestaurant(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Integer id
    ) {
        restaurantService.deleteRestaurant(userDetails.getUser(), id);
        return ResponseEntity.ok(ApiResponse.message("Restaurant deleted"));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponse<RestaurantResponseDto>> patchStatus(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Integer id,
        @RequestBody PatchStatusRequest req
    ) {
        return ResponseEntity.ok(ApiResponse.success(restaurantService.patchStatus(userDetails.getUser(), id, req)));
    }

    @PatchMapping("/{id}/today-status")
    public ResponseEntity<ApiResponse<RestaurantResponseDto>> patchTodayStatus(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Integer id,
        @RequestBody PatchStatusRequest req
    ) {
        return ResponseEntity.ok(ApiResponse.success(restaurantService.patchTodayStatus(userDetails.getUser(), id, req)));
    }

    @PatchMapping("/{id}/location")
    public ResponseEntity<ApiResponse<RestaurantResponseDto>> patchLocation(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Integer id,
        @Valid @RequestBody PatchLocationRequest req
    ) {
        return ResponseEntity.ok(ApiResponse.success(restaurantService.patchLocation(userDetails.getUser(), id, req)));
    }

    // Admin endpoints
    @GetMapping("/admin/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<RestaurantResponseDto>>> listPendingRestaurants() {
        return ResponseEntity.ok(ApiResponse.success(restaurantService.listPendingRestaurants()));
    }

    @PatchMapping("/admin/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RestaurantResponseDto>> approveRestaurant(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Integer id
    ) {
        return ResponseEntity.ok(ApiResponse.success(restaurantService.approveRestaurant(userDetails.getUser(), id)));
    }

    @PatchMapping("/admin/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<RestaurantResponseDto>> rejectRestaurant(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Integer id,
        @RequestBody RejectRequest req
    ) {
        return ResponseEntity.ok(ApiResponse.success(restaurantService.rejectRestaurant(userDetails.getUser(), id, req)));
    }

    @GetMapping("/admin/change-requests")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<RestaurantChangeRequest>>> listChangeRequests() {
        return ResponseEntity.ok(ApiResponse.success(restaurantService.listChangeRequests()));
    }

    @PatchMapping("/admin/change-requests/{id}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> approveChangeRequest(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Integer id
    ) {
        restaurantService.approveChangeRequest(userDetails.getUser(), id);
        return ResponseEntity.ok(ApiResponse.message("Change request approved"));
    }

    @PatchMapping("/admin/change-requests/{id}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> rejectChangeRequest(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Integer id,
        @RequestBody RejectRequest req
    ) {
        restaurantService.rejectChangeRequest(userDetails.getUser(), id, req);
        return ResponseEntity.ok(ApiResponse.message("Change request rejected"));
    }
}
