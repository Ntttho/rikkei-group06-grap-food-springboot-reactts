package com.grabfood.service;

import com.grabfood.dto.CategoryDto.*;
import com.grabfood.entity.User;

import java.util.List;

public interface CategoryService {
    List<CategoryResponseDto> getAllCategories(Integer restaurantId);
    CategoryResponseDto getCategoryById(Integer id);
    CategoryResponseDto createCategory(User user, CreateCategoryRequest req);
    CategoryResponseDto updateCategory(User user, Integer id, UpdateCategoryRequest req);
    void deleteCategory(User user, Integer id);
}
