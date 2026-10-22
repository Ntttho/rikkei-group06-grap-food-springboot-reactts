package com.grabfood.repository;

import com.grabfood.entity.RestaurantChangeRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RestaurantChangeRequestRepository extends JpaRepository<RestaurantChangeRequest, Integer> {
    List<RestaurantChangeRequest> findByStatus(String status);
    List<RestaurantChangeRequest> findByRestaurantId(Integer restaurantId);
}
