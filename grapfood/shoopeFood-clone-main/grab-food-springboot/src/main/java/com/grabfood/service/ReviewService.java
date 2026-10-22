package com.grabfood.service;

import com.grabfood.dto.CommonDto.CreateReviewRequest;
import com.grabfood.entity.Review;
import com.grabfood.entity.User;

import java.util.List;
import java.util.Map;

public interface ReviewService {
    Review createReview(User customer, CreateReviewRequest req);
    Map<String, Object> getRestaurantReviewSummary(Integer restaurantId);
    List<Review> getRestaurantReviews(Integer restaurantId);
}
