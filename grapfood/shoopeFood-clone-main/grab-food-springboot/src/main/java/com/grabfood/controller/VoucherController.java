package com.grabfood.controller;

import com.grabfood.dto.ApiResponse;
import com.grabfood.dto.CommonDto.ValidateVoucherRequest;
import com.grabfood.entity.Voucher;
import com.grabfood.service.VoucherService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/vouchers")
@RequiredArgsConstructor
public class VoucherController {

    private final VoucherService voucherService;

    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<Voucher>> validateVoucher(@Valid @RequestBody ValidateVoucherRequest req) {
        return ResponseEntity.ok(ApiResponse.success(voucherService.validateVoucher(req)));
    }
}
