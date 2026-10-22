package com.grabfood.controller;

import com.grabfood.dto.ApiResponse;
import com.grabfood.dto.CategoryDto.*;
import com.grabfood.security.CustomUserDetails;
import com.grabfood.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponseDto>>> getAllCategories(
        @RequestParam(required = false) Integer restaurantId
    ) {
        return ResponseEntity.ok(ApiResponse.success(categoryService.getAllCategories(restaurantId)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryResponseDto>> getCategoryById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(categoryService.getCategoryById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('MERCHANT', 'ADMIN')")
    public ResponseEntity<ApiResponse<CategoryResponseDto>> createCategory(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @Valid @RequestBody CreateCategoryRequest req
    ) {
        return ResponseEntity.ok(ApiResponse.success(categoryService.createCategory(userDetails.getUser(), req)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('MERCHANT', 'ADMIN')")
    public ResponseEntity<ApiResponse<CategoryResponseDto>> updateCategory(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Integer id,
        @RequestBody UpdateCategoryRequest req
    ) {
        return ResponseEntity.ok(ApiResponse.success(categoryService.updateCategory(userDetails.getUser(), id, req)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('MERCHANT', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Integer id
    ) {
        categoryService.deleteCategory(userDetails.getUser(), id);
        return ResponseEntity.ok(ApiResponse.message("Category deleted"));
    }
}
