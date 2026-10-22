package com.grabfood.controller;

import com.grabfood.dto.ApiResponse;
import com.grabfood.dto.DriverDto.*;
import com.grabfood.dto.OrderDto.OrderResponseDto;
import com.grabfood.security.CustomUserDetails;
import com.grabfood.service.DriverService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drivers")
@RequiredArgsConstructor
public class DriverController {

    private final DriverService driverService;

    @GetMapping("/me/orders")
    @PreAuthorize("hasAnyRole('DRIVER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<OrderResponseDto>>> getMyOrderFeed(
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.success(driverService.getMyOrderFeed(userDetails.getUser())));
    }

    @GetMapping("/me/metrics")
    @PreAuthorize("hasAnyRole('DRIVER', 'ADMIN')")
    public ResponseEntity<ApiResponse<PerformanceMetricsDto>> getMyPerformanceMetrics(
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.success(driverService.getMyPerformanceMetrics(userDetails.getUser())));
    }

    @GetMapping("/me/completed")
    @PreAuthorize("hasAnyRole('DRIVER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<OrderResponseDto>>> getMyCompletedOrders(
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.success(driverService.getMyCompletedOrders(userDetails.getUser())));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('DRIVER', 'ADMIN')")
    public ResponseEntity<ApiResponse<List<DriverProfileDto>>> getDrivers() {
        return ResponseEntity.ok(ApiResponse.success(driverService.getDrivers()));
    }

    @GetMapping("/admin/{id}/metrics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PerformanceMetricsDto>> getDriverPerformanceMetricsAdmin(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(driverService.getDriverPerformanceMetricsAdmin(id)));
    }

    @PostMapping("/admin/penalties/{penaltyId}/revoke")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> revokeDriverPenalty(@PathVariable Integer penaltyId) {
        driverService.revokeDriverPenalty(penaltyId);
        return ResponseEntity.ok(ApiResponse.message("Penalty revoked"));
    }

    @GetMapping("/{id}/profile")
    public ResponseEntity<ApiResponse<DriverProfileDto>> getDriverProfile(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(driverService.getDriverProfile(id)));
    }

    @GetMapping("/{id}/location")
    public ResponseEntity<ApiResponse<DriverLocationDto>> getLatestDriverLocation(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(driverService.getLatestDriverLocation(id)));
    }

    @PostMapping("/{id}/location")
    public ResponseEntity<ApiResponse<DriverLocationDto>> updateDriverLocation(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Integer id,
        @Valid @RequestBody UpdateLocationRequest req
    ) {
        return ResponseEntity.ok(ApiResponse.success(driverService.updateDriverLocation(userDetails.getUser(), id, req)));
    }

    @PutMapping("/{id}/online")
    public ResponseEntity<ApiResponse<DriverProfileDto>> updateDriverOnlineStatus(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Integer id,
        @RequestBody OnlineStatusRequest req
    ) {
        return ResponseEntity.ok(ApiResponse.success(driverService.updateDriverOnlineStatus(userDetails.getUser(), id, req.getIsOnline())));
    }

    @PutMapping("/{id}/online/on")
    public ResponseEntity<ApiResponse<DriverProfileDto>> setDriverOnline(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Integer id
    ) {
        return ResponseEntity.ok(ApiResponse.success(driverService.updateDriverOnlineStatus(userDetails.getUser(), id, true)));
    }

    @PutMapping("/{id}/online/off")
    public ResponseEntity<ApiResponse<DriverProfileDto>> setDriverOffline(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Integer id
    ) {
        return ResponseEntity.ok(ApiResponse.success(driverService.updateDriverOnlineStatus(userDetails.getUser(), id, false)));
    }
}
