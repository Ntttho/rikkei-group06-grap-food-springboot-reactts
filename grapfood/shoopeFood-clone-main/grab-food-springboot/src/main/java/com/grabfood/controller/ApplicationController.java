package com.grabfood.controller;

import com.grabfood.dto.ApiResponse;
import com.grabfood.dto.CommonDto.DriverApplicationRequest;
import com.grabfood.dto.CommonDto.MerchantApplicationRequest;
import com.grabfood.entity.DriverDetail;
import com.grabfood.security.CustomUserDetails;
import com.grabfood.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @GetMapping("/my-status")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMyApplicationStatus(
        @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.success(applicationService.getMyApplicationStatus(userDetails.getUser())));
    }

    @PostMapping("/driver")
    public ResponseEntity<ApiResponse<DriverDetail>> applyDriver(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @RequestBody DriverApplicationRequest req
    ) {
        return ResponseEntity.ok(ApiResponse.success(applicationService.applyDriver(userDetails.getUser(), req)));
    }

    @PostMapping("/merchant")
    public ResponseEntity<ApiResponse<Void>> applyMerchant(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @RequestBody MerchantApplicationRequest req
    ) {
        applicationService.applyMerchant(userDetails.getUser(), req);
        return ResponseEntity.ok(ApiResponse.message("Merchant application submitted"));
    }

    @GetMapping("/drivers/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<DriverDetail>>> listPendingDrivers() {
        return ResponseEntity.ok(ApiResponse.success(applicationService.listPendingDrivers()));
    }

    @PatchMapping("/drivers/{userId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DriverDetail>> approveDriver(@PathVariable Integer userId) {
        return ResponseEntity.ok(ApiResponse.success(applicationService.approveDriver(userId)));
    }

    @PatchMapping("/drivers/{userId}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DriverDetail>> rejectDriver(@PathVariable Integer userId) {
        return ResponseEntity.ok(ApiResponse.success(applicationService.rejectDriver(userId)));
    }
}
