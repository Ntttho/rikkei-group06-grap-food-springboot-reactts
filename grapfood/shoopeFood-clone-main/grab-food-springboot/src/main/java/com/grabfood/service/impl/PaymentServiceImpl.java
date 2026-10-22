package com.grabfood.service.impl;

import com.grabfood.dto.CommonDto.CreatePaymentRequest;
import com.grabfood.dto.CommonDto.PaymentCallbackRequest;
import com.grabfood.entity.Order;
import com.grabfood.entity.Payment;
import com.grabfood.entity.PaymentTransaction;
import com.grabfood.exception.BadRequestException;
import com.grabfood.exception.ResourceNotFoundException;
import com.grabfood.repository.OrderRepository;
import com.grabfood.repository.PaymentRepository;
import com.grabfood.repository.PaymentTransactionRepository;
import com.grabfood.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final PaymentTransactionRepository transactionRepository;
    private final OrderRepository orderRepository;

    @Override
    @Transactional
    public Payment createPayment(CreatePaymentRequest req) {
        Order order = orderRepository.findById(req.getOrderId())
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        return paymentRepository.findByOrderId(order.getId()).orElseGet(() -> {
            Payment payment = Payment.builder()
                .order(order)
                .idempotencyKey(req.getIdempotencyKey() != null ? req.getIdempotencyKey() : UUID.randomUUID().toString())
                .paymentMethod(req.getPaymentMethod() != null ? req.getPaymentMethod() : "CASH")
                .status("PENDING")
                .amount(req.getAmount() != null ? req.getAmount() : order.getTotalAmount())
                .createdAt(LocalDateTime.now())
                .build();
            return paymentRepository.save(payment);
        });
    }

    @Override
    @Transactional
    public Payment processPaymentCallback(PaymentCallbackRequest req) {
        Payment payment = paymentRepository.findByOrderId(req.getOrderId())
            .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order"));

        String status = req.getStatus() != null ? req.getStatus() : "SUCCESS";
        payment.setStatus(status);
        payment.setUpdatedAt(LocalDateTime.now());
        Payment saved = paymentRepository.save(payment);

        PaymentTransaction tx = PaymentTransaction.builder()
            .payment(saved)
            .status(status)
            .transactionRef(req.getTransactionRef())
            .gatewayResponse(req.getGatewayResponse())
            .createdAt(LocalDateTime.now())
            .build();
        transactionRepository.save(tx);

        return saved;
    }

    @Override
    public Payment getPaymentStatus(Long orderId) {
        return paymentRepository.findByOrderId(orderId)
            .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order"));
    }
}
