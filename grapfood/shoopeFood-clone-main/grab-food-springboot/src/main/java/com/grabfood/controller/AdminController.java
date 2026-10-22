package com.grabfood.controller;

import com.grabfood.dto.ApiResponse;
import com.grabfood.dto.CommonDto.CreateSettingRequest;
import com.grabfood.dto.CommonDto.CreateVoucherRequest;
import com.grabfood.entity.SystemSetting;
import com.grabfood.entity.Voucher;
import com.grabfood.service.AdminSettingService;
import com.grabfood.service.VoucherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final VoucherService voucherService;
    private final AdminSettingService settingService;

    // Vouchers
    @GetMapping("/vouchers")
    public ResponseEntity<ApiResponse<List<Voucher>>> getVouchers() {
        return ResponseEntity.ok(ApiResponse.success(voucherService.getAllVouchers()));
    }

    @GetMapping("/vouchers/{id}")
    public ResponseEntity<ApiResponse<Voucher>> getVoucherById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(voucherService.getVoucherById(id)));
    }

    @PostMapping("/vouchers")
    public ResponseEntity<ApiResponse<Voucher>> createVoucher(@Valid @RequestBody CreateVoucherRequest req) {
        return ResponseEntity.ok(ApiResponse.success(voucherService.createVoucher(req)));
    }

    @PutMapping("/vouchers/{id}")
    public ResponseEntity<ApiResponse<Voucher>> updateVoucher(@PathVariable Integer id, @RequestBody CreateVoucherRequest req) {
        return ResponseEntity.ok(ApiResponse.success(voucherService.updateVoucher(id, req)));
    }

    @DeleteMapping("/vouchers/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteVoucher(@PathVariable Integer id) {
        voucherService.deleteVoucher(id);
        return ResponseEntity.ok(ApiResponse.message("Voucher deleted"));
    }

    // Settings
    @GetMapping("/settings")
    public ResponseEntity<ApiResponse<List<SystemSetting>>> getSettings() {
        return ResponseEntity.ok(ApiResponse.success(settingService.getSettings()));
    }

    @PostMapping("/settings")
    public ResponseEntity<ApiResponse<SystemSetting>> createSetting(@Valid @RequestBody CreateSettingRequest req) {
        return ResponseEntity.ok(ApiResponse.success(settingService.createSetting(req)));
    }

    @PutMapping("/settings/{id}")
    public ResponseEntity<ApiResponse<SystemSetting>> updateSetting(@PathVariable Integer id, @RequestBody CreateSettingRequest req) {
        return ResponseEntity.ok(ApiResponse.success(settingService.updateSetting(id, req)));
    }

    @DeleteMapping("/settings/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteSetting(@PathVariable Integer id) {
        settingService.deleteSetting(id);
        return ResponseEntity.ok(ApiResponse.message("Setting deleted"));
    }
}
