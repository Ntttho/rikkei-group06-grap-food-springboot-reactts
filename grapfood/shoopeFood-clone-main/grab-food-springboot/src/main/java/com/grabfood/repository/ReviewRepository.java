package com.grabfood.repository;

import com.grabfood.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByTargetTypeAndTargetId(String targetType, Integer targetId);
    Optional<Review> findByOrderIdAndTargetType(Long orderId, String targetType);
}
