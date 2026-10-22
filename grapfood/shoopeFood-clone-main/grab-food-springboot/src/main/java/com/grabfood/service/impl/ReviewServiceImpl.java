package com.grabfood.service.impl;

import com.grabfood.dto.CommonDto.CreateReviewRequest;
import com.grabfood.entity.Review;
import com.grabfood.entity.User;
import com.grabfood.exception.BadRequestException;
import com.grabfood.repository.ReviewRepository;
import com.grabfood.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;

    @Override
    @Transactional
    public Review createReview(User customer, CreateReviewRequest req) {
        if (req.getRating() != null && (req.getRating() < 1 || req.getRating() > 5)) {
            throw new BadRequestException("Rating must be between 1 and 5");
        }

        reviewRepository.findByOrderIdAndTargetType(req.getOrderId(), req.getTargetType().toUpperCase())
            .ifPresent(r -> {
                throw new BadRequestException("You have already reviewed this target for this order");
            });

        Review review = Review.builder()
            .orderId(req.getOrderId())
            .customer(customer)
            .targetType(req.getTargetType().toUpperCase())
            .targetId(req.getTargetId())
            .rating(req.getRating())
            .comment(req.getComment())
            .createdAt(LocalDateTime.now())
            .build();

        return reviewRepository.save(review);
    }

    @Override
    public Map<String, Object> getRestaurantReviewSummary(Integer restaurantId) {
        List<Review> reviews = (restaurantId != null)
            ? reviewRepository.findByTargetTypeAndTargetId("RESTAURANT", restaurantId)
            : List.of();

        double avgRating = reviews.stream()
            .filter(r -> r.getRating() != null)
            .mapToInt(Review::getRating)
            .average()
            .orElse(5.0);

        Map<String, Object> res = new HashMap<>();
        res.put("totalReviews", reviews.size());
        res.put("averageRating", Math.round(avgRating * 100.0) / 100.0);
        res.put("reviews", reviews);
        return res;
    }

    @Override
    public List<Review> getRestaurantReviews(Integer restaurantId) {
        return reviewRepository.findByTargetTypeAndTargetId("RESTAURANT", restaurantId);
    }
}
