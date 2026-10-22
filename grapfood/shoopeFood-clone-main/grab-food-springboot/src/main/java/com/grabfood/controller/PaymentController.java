package com.grabfood.controller;

import com.grabfood.dto.ApiResponse;
import com.grabfood.dto.CommonDto.CreatePaymentRequest;
import com.grabfood.dto.CommonDto.PaymentCallbackRequest;
import com.grabfood.entity.Payment;
import com.grabfood.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<Payment>> createPayment(@Valid @RequestBody CreatePaymentRequest req) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.createPayment(req)));
    }

    @PostMapping("/callback")
    public ResponseEntity<ApiResponse<Payment>> callback(@RequestBody PaymentCallbackRequest req) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.processPaymentCallback(req)));
    }

    @GetMapping("/{orderId}")
    public ResponseEntity<ApiResponse<Payment>> getPaymentStatus(@PathVariable Long orderId) {
        return ResponseEntity.ok(ApiResponse.success(paymentService.getPaymentStatus(orderId)));
    }
}
