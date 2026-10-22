package com.grabfood.service.impl;

import com.grabfood.dto.DriverDto.*;
import com.grabfood.dto.OrderDto.OrderResponseDto;
import com.grabfood.entity.*;
import com.grabfood.exception.ForbiddenException;
import com.grabfood.exception.ResourceNotFoundException;
import com.grabfood.repository.*;
import com.grabfood.service.DriverService;
import com.grabfood.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DriverServiceImpl implements DriverService {

    private final UserRepository userRepository;
    private final DriverDetailRepository driverDetailRepository;
    private final DriverLocationRepository driverLocationRepository;
    private final DriverPenaltyRepository driverPenaltyRepository;
    private final OrderRepository orderRepository;
    private final OrderService orderService;

    @Override
    public List<OrderResponseDto> getMyOrderFeed(User driver) {
        // Return available confirmed orders and active driver orders
        List<Order> activeOrders = orderRepository.findByDriverIdOrderByCreatedAtDesc(driver.getId());
        List<Order> confirmedOrders = orderRepository.findByStatusCode("CONFIRMED");

        activeOrders.addAll(confirmedOrders);
        return activeOrders.stream()
            .map(o -> orderService.getOrderById(o.getId()))
            .collect(Collectors.toList());
    }

    @Override
    public PerformanceMetricsDto getMyPerformanceMetrics(User driver) {
        return calculateMetrics(driver.getId());
    }

    @Override
    public List<OrderResponseDto> getMyCompletedOrders(User driver) {
        return orderRepository.findByDriverIdOrderByCreatedAtDesc(driver.getId()).stream()
            .filter(o -> "COMPLETED".equalsIgnoreCase(o.getStatus().getCode()))
            .map(o -> orderService.getOrderById(o.getId()))
            .collect(Collectors.toList());
    }

    @Override
    public List<DriverProfileDto> getDrivers() {
        return userRepository.findByRoleName("DRIVER").stream()
            .map(this::mapToDriverProfile)
            .collect(Collectors.toList());
    }

    @Override
    public PerformanceMetricsDto getDriverPerformanceMetricsAdmin(Integer driverId) {
        return calculateMetrics(driverId);
    }

    @Override
    @Transactional
    public void revokeDriverPenalty(Integer penaltyId) {
        driverPenaltyRepository.findById(Long.valueOf(penaltyId)).ifPresent(p -> {
            p.setStatus("REVOKED");
            driverPenaltyRepository.save(p);
        });
    }

    @Override
    public DriverProfileDto getDriverProfile(Integer driverId) {
        User user = userRepository.findById(driverId)
            .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));
        return mapToDriverProfile(user);
    }

    @Override
    public DriverLocationDto getLatestDriverLocation(Integer driverId) {
        DriverLocation loc = driverLocationRepository.findFirstByDriverIdOrderByCreatedAtDesc(driverId)
            .orElseThrow(() -> new ResourceNotFoundException("No location found for driver: " + driverId));

        return DriverLocationDto.builder()
            .id(loc.getId())
            .driverId(loc.getDriver().getId())
            .orderId(loc.getOrderId())
            .latitude(loc.getLatitude())
            .longitude(loc.getLongitude())
            .heading(loc.getHeading())
            .speedKmh(loc.getSpeedKmh())
            .createdAt(loc.getCreatedAt())
            .build();
    }

    @Override
    @Transactional
    public DriverLocationDto updateDriverLocation(User driver, Integer driverId, UpdateLocationRequest req) {
        if (!driver.hasRole("ADMIN") && !driver.getId().equals(driverId)) {
            throw new ForbiddenException("Cannot update location for other drivers");
        }

        User targetDriver = userRepository.findById(driverId)
            .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));

        DriverLocation loc = DriverLocation.builder()
            .driver(targetDriver)
            .latitude(req.getLatitude())
            .longitude(req.getLongitude())
            .heading(req.getHeading() != null ? req.getHeading() : 0.0)
            .speedKmh(req.getSpeedKmh() != null ? req.getSpeedKmh() : 24.0)
            .orderId(req.getOrderId())
            .build();

        DriverLocation saved = driverLocationRepository.save(loc);

        return DriverLocationDto.builder()
            .id(saved.getId())
            .driverId(targetDriver.getId())
            .orderId(saved.getOrderId())
            .latitude(saved.getLatitude())
            .longitude(saved.getLongitude())
            .heading(saved.getHeading())
            .speedKmh(saved.getSpeedKmh())
            .createdAt(saved.getCreatedAt())
            .build();
    }

    @Override
    @Transactional
    public DriverProfileDto updateDriverOnlineStatus(User driver, Integer driverId, Boolean isOnline) {
        if (!driver.hasRole("ADMIN") && !driver.getId().equals(driverId)) {
            throw new ForbiddenException("Cannot update online status for other drivers");
        }

        User targetDriver = userRepository.findById(driverId)
            .orElseThrow(() -> new ResourceNotFoundException("Driver not found"));

        DriverDetail detail = driverDetailRepository.findById(driverId)
            .orElseGet(() -> DriverDetail.builder().user(targetDriver).userId(driverId).build());

        detail.setIsOnline(isOnline);
        driverDetailRepository.save(detail);

        return mapToDriverProfile(targetDriver);
    }

    private PerformanceMetricsDto calculateMetrics(Integer driverId) {
        List<Order> orders = orderRepository.findByDriverIdOrderByCreatedAtDesc(driverId);
        int total = orders.size();
        int completed = (int) orders.stream().filter(o -> "COMPLETED".equalsIgnoreCase(o.getStatus().getCode())).count();
        int cancelled = (int) orders.stream().filter(o -> "CANCELLED".equalsIgnoreCase(o.getStatus().getCode())).count();
        double rate = total > 0 ? (double) completed / total * 100 : 100.0;

        BigDecimal earnings = orders.stream()
            .filter(o -> "COMPLETED".equalsIgnoreCase(o.getStatus().getCode()))
            .map(Order::getShippingFee)
            .filter(java.util.Objects::nonNull)
            .reduce(BigDecimal.ZERO, BigDecimal::add);

        User driver = userRepository.findById(driverId).orElse(null);

        return PerformanceMetricsDto.builder()
            .totalOrders(total)
            .completedOrders(completed)
            .cancelledOrders(cancelled)
            .completionRate(rate)
            .totalEarnings(earnings)
            .ratingAvg(driver != null ? driver.getRatingAvg() : new BigDecimal("5.00"))
            .build();
    }

    private DriverProfileDto mapToDriverProfile(User u) {
        DriverDetail detail = driverDetailRepository.findById(u.getId()).orElse(null);
        return DriverProfileDto.builder()
            .id(u.getId())
            .fullName(u.getFullName())
            .phone(u.getPhone())
            .licensePlate(detail != null ? detail.getLicensePlate() : null)
            .vehicleType(detail != null ? detail.getVehicleType() : null)
            .idCardNumber(detail != null ? detail.getIdCardNumber() : null)
            .approvalStatus(detail != null ? detail.getApprovalStatus() : "PENDING")
            .isOnline(detail != null && Boolean.TRUE.equals(detail.getIsOnline()))
            .ratingAvg(u.getRatingAvg())
            .build();
    }
}
