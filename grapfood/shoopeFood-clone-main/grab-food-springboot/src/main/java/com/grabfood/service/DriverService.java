package com.grabfood.service;

import com.grabfood.dto.DriverDto.*;
import com.grabfood.dto.OrderDto.OrderResponseDto;
import com.grabfood.entity.User;

import java.util.List;

public interface DriverService {
    List<OrderResponseDto> getMyOrderFeed(User driver);
    PerformanceMetricsDto getMyPerformanceMetrics(User driver);
    List<OrderResponseDto> getMyCompletedOrders(User driver);
    List<DriverProfileDto> getDrivers();
    PerformanceMetricsDto getDriverPerformanceMetricsAdmin(Integer driverId);
    void revokeDriverPenalty(Integer penaltyId);
    DriverProfileDto getDriverProfile(Integer driverId);
    DriverLocationDto getLatestDriverLocation(Integer driverId);
    DriverLocationDto updateDriverLocation(User driver, Integer driverId, UpdateLocationRequest req);
    DriverProfileDto updateDriverOnlineStatus(User driver, Integer driverId, Boolean isOnline);
}
