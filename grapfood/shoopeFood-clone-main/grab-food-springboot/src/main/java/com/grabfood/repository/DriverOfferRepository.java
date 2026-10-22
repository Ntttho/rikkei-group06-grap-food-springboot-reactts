package com.grabfood.repository;

import com.grabfood.entity.DriverOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DriverOfferRepository extends JpaRepository<DriverOffer, Long> {
    List<DriverOffer> findByDriverIdAndStatus(Integer driverId, String status);
    List<DriverOffer> findByOrderId(Long orderId);
    Optional<DriverOffer> findByOrderIdAndDriverId(Long orderId, Integer driverId);
}
