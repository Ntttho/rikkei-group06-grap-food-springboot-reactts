package com.grabfood.controller;

import com.grabfood.dto.ApiResponse;
import com.grabfood.dto.OrderDto.*;
import com.grabfood.security.CustomUserDetails;
import com.grabfood.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping({"", "/secure"})
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<ApiResponse<OrderResponseDto>> createOrder(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @Valid @RequestBody CreateOrderRequest req
    ) {
        OrderResponseDto dto = orderService.createOrder(userDetails.getUser(), req);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrderResponseDto>>> getOrders(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @RequestParam(required = false) String status,
        @RequestParam(required = false) Integer restaurantId,
        @RequestParam(required = false) Integer driverId,
        @RequestParam(required = false) Integer customerId
    ) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getOrders(userDetails.getUser(), status, restaurantId, driverId, customerId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponseDto>> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getOrderById(id)));
    }

    @GetMapping("/{id}/tracking")
    public ResponseEntity<ApiResponse<OrderResponseDto>> getOrderTracking(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(orderService.getOrderTracking(id)));
    }

    @PostMapping("/{id}/accept")
    @PreAuthorize("hasAnyRole('DRIVER', 'ADMIN')")
    public ResponseEntity<ApiResponse<OrderResponseDto>> acceptOrder(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Long id
    ) {
        return ResponseEntity.ok(ApiResponse.success("Driver accepted order", orderService.acceptOrder(userDetails.getUser(), id)));
    }

    @PostMapping("/{id}/reject-offer")
    @PreAuthorize("hasAnyRole('DRIVER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> rejectOffer(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Long id,
        @RequestBody(required = false) RejectOrderRequest req
    ) {
        orderService.rejectDriverOffer(userDetails.getUser(), id, req);
        return ResponseEntity.ok(ApiResponse.message("Offer rejected"));
    }

    @PostMapping("/{id}/driver-cancel")
    @PreAuthorize("hasAnyRole('DRIVER', 'ADMIN')")
    public ResponseEntity<ApiResponse<OrderResponseDto>> cancelDriverOrder(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Long id,
        @RequestBody(required = false) CancelOrderRequest req
    ) {
        return ResponseEntity.ok(ApiResponse.success(orderService.cancelDriverOrder(userDetails.getUser(), id, req)));
    }

    @PostMapping("/{id}/cancel")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<ApiResponse<OrderResponseDto>> cancelOrder(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Long id,
        @RequestBody(required = false) CancelOrderRequest req
    ) {
        return ResponseEntity.ok(ApiResponse.success(orderService.cancelOrder(userDetails.getUser(), id, req)));
    }

    @PatchMapping("/{id}/reject")
    @PreAuthorize("hasAnyRole('MERCHANT', 'ADMIN')")
    public ResponseEntity<ApiResponse<OrderResponseDto>> rejectOrder(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Long id,
        @RequestBody(required = false) RejectOrderRequest req
    ) {
        return ResponseEntity.ok(ApiResponse.success(orderService.rejectOrder(userDetails.getUser(), id, req)));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<OrderResponseDto>> updateOrderStatus(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Long id,
        @RequestBody UpdateOrderStatusRequest req
    ) {
        return ResponseEntity.ok(ApiResponse.success(orderService.updateOrderStatus(userDetails.getUser(), id, req)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteOrder(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Long id
    ) {
        orderService.deleteOrder(userDetails.getUser(), id);
        return ResponseEntity.ok(ApiResponse.message("Order deleted"));
    }
}
