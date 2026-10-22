package com.grabfood.repository;

import com.grabfood.entity.DriverPenalty;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DriverPenaltyRepository extends JpaRepository<DriverPenalty, Long> {
    List<DriverPenalty> findByDriverId(Integer driverId);
    List<DriverPenalty> findByDriverIdAndStatus(Integer driverId, String status);
}
