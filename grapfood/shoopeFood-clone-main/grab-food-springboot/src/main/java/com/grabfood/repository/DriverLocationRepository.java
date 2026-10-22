package com.grabfood.repository;

import com.grabfood.entity.DriverLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverLocationRepository extends JpaRepository<DriverLocation, Long> {
    Optional<DriverLocation> findFirstByDriverIdOrderByCreatedAtDesc(Integer driverId);
    List<DriverLocation> findByDriverIdOrderByCreatedAtDesc(Integer driverId);
    List<DriverLocation> findByOrderIdOrderByCreatedAtDesc(Long orderId);
}
