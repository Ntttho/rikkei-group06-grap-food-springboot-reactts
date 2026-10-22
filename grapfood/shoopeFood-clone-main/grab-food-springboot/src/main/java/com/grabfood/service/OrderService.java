package com.grabfood.service;

import com.grabfood.dto.OrderDto.*;
import com.grabfood.entity.User;

import java.util.List;

public interface OrderService {
    OrderResponseDto createOrder(User customer, CreateOrderRequest req);
    List<OrderResponseDto> getOrders(User user, String status, Integer restaurantId, Integer driverId, Integer customerId);
    OrderResponseDto getOrderById(Long id);
    OrderResponseDto getOrderTracking(Long id);
    OrderResponseDto updateOrderStatus(User user, Long id, UpdateOrderStatusRequest req);
    OrderResponseDto acceptOrder(User driver, Long id);
    void rejectDriverOffer(User driver, Long id, RejectOrderRequest req);
    OrderResponseDto cancelDriverOrder(User driver, Long id, CancelOrderRequest req);
    OrderResponseDto cancelOrder(User customer, Long id, CancelOrderRequest req);
    OrderResponseDto rejectOrder(User merchant, Long id, RejectOrderRequest req);
    void deleteOrder(User admin, Long id);
}
