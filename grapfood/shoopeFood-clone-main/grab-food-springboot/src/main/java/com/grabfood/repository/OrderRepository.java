package com.grabfood.repository;

import com.grabfood.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    Optional<Order> findByIdempotencyKey(String idempotencyKey);

    Optional<Order> findByOrderCode(String orderCode);

    List<Order> findByCustomerIdOrderByCreatedAtDesc(Integer customerId);

    List<Order> findByDriverIdOrderByCreatedAtDesc(Integer driverId);

    List<Order> findByRestaurantIdOrderByCreatedAtDesc(Integer restaurantId);

    @Query("SELECT o FROM Order o WHERE o.restaurant.owner.id = :merchantId ORDER BY o.createdAt DESC")
    List<Order> findByMerchantId(@Param("merchantId") Integer merchantId);

    @Query("SELECT o FROM Order o WHERE o.status.code = :statusCode ORDER BY o.createdAt DESC")
    List<Order> findByStatusCode(@Param("statusCode") String statusCode);

    @Query("SELECT o FROM Order o ORDER BY o.createdAt DESC")
    List<Order> findAllOrdersDesc();
}
