package com.grabfood.service;

import com.grabfood.dto.CommonDto.CreatePaymentRequest;
import com.grabfood.dto.CommonDto.PaymentCallbackRequest;
import com.grabfood.entity.Payment;

public interface PaymentService {
    Payment createPayment(CreatePaymentRequest req);
    Payment processPaymentCallback(PaymentCallbackRequest req);
    Payment getPaymentStatus(Long orderId);
}
