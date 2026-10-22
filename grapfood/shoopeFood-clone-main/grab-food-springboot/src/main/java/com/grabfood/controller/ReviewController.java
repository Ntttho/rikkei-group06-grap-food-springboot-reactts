package com.grabfood.controller;

import com.grabfood.dto.ApiResponse;
import com.grabfood.dto.CommonDto.CreateReviewRequest;
import com.grabfood.entity.Review;
import com.grabfood.security.CustomUserDetails;
import com.grabfood.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;

    @PostMapping
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Review>> createReview(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @Valid @RequestBody CreateReviewRequest req
    ) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.createReview(userDetails.getUser(), req)));
    }

    @GetMapping("/restaurants/summary")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getRestaurantReviewSummary(
        @RequestParam(required = false) Integer restaurantId
    ) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getRestaurantReviewSummary(restaurantId)));
    }

    @GetMapping("/restaurants/{restaurantId}")
    public ResponseEntity<ApiResponse<java.util.List<Review>>> getRestaurantReviews(
        @PathVariable Integer restaurantId
    ) {
        return ResponseEntity.ok(ApiResponse.success(reviewService.getRestaurantReviews(restaurantId)));
    }
}
