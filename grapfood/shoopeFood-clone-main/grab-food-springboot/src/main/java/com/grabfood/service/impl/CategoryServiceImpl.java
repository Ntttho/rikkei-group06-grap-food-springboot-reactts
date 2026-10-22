package com.grabfood.service.impl;

import com.grabfood.dto.CategoryDto.*;
import com.grabfood.dto.FoodDto;
import com.grabfood.entity.Category;
import com.grabfood.entity.FoodItem;
import com.grabfood.entity.Restaurant;
import com.grabfood.entity.User;
import com.grabfood.exception.ForbiddenException;
import com.grabfood.exception.ResourceNotFoundException;
import com.grabfood.repository.CategoryRepository;
import com.grabfood.repository.FoodItemRepository;
import com.grabfood.repository.RestaurantRepository;
import com.grabfood.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;
    private final RestaurantRepository restaurantRepository;
    private final FoodItemRepository foodItemRepository;

    @Override
    public List<CategoryResponseDto> getAllCategories(Integer restaurantId) {
        List<Category> categories = (restaurantId != null)
            ? categoryRepository.findByRestaurantId(restaurantId)
            : categoryRepository.findAll();

        return categories.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public CategoryResponseDto getCategoryById(Integer id) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
        return mapToDto(category);
    }

    @Override
    @Transactional
    public CategoryResponseDto createCategory(User user, CreateCategoryRequest req) {
        Restaurant restaurant = restaurantRepository.findById(req.getRestaurantId())
            .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        if (!user.hasRole("ADMIN") && !restaurant.getOwner().getId().equals(user.getId())) {
            throw new ForbiddenException("Not authorized to manage this restaurant's categories");
        }

        Category category = Category.builder()
            .restaurant(restaurant)
            .name(req.getName())
            .build();

        return mapToDto(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public CategoryResponseDto updateCategory(User user, Integer id, UpdateCategoryRequest req) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (!user.hasRole("ADMIN") && !category.getRestaurant().getOwner().getId().equals(user.getId())) {
            throw new ForbiddenException("Not authorized to manage this restaurant's categories");
        }

        if (req.getName() != null) {
            category.setName(req.getName());
        }

        return mapToDto(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public void deleteCategory(User user, Integer id) {
        Category category = categoryRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (!user.hasRole("ADMIN") && !category.getRestaurant().getOwner().getId().equals(user.getId())) {
            throw new ForbiddenException("Not authorized to manage this restaurant's categories");
        }

        categoryRepository.delete(category);
    }

    private CategoryResponseDto mapToDto(Category c) {
        List<FoodItem> foods = foodItemRepository.findByCategoryIdAndDeletedAtIsNull(c.getId());
        List<FoodDto.FoodResponseDto> foodDtos = foods.stream().map(f ->
            FoodDto.FoodResponseDto.builder()
                .id(f.getId())
                .categoryId(c.getId())
                .categoryName(c.getName())
                .name(f.getName())
                .price(f.getPrice())
                .isAvailable(f.getIsAvailable())
                .defaultQuantity(f.getDefaultQuantity())
                .currentQuantity(f.getCurrentQuantity())
                .imageUrl(f.getImageUrl())
                .build()
        ).collect(Collectors.toList());

        return CategoryResponseDto.builder()
            .id(c.getId())
            .restaurantId(c.getRestaurant() != null ? c.getRestaurant().getId() : null)
            .name(c.getName())
            .foods(foodDtos)
            .build();
    }
}
