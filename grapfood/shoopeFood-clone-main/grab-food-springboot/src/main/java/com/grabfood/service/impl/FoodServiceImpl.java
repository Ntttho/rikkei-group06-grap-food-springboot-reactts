package com.grabfood.service.impl;

import com.grabfood.dto.FoodDto.*;
import com.grabfood.dto.ToppingDto;
import com.grabfood.entity.Category;
import com.grabfood.entity.FoodItem;
import com.grabfood.entity.User;
import com.grabfood.exception.ForbiddenException;
import com.grabfood.exception.ResourceNotFoundException;
import com.grabfood.repository.CategoryRepository;
import com.grabfood.repository.FoodItemRepository;
import com.grabfood.service.FoodService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FoodServiceImpl implements FoodService {

    private final FoodItemRepository foodItemRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public List<FoodResponseDto> getAllFoods(Integer categoryId, Integer restaurantId) {
        List<FoodItem> foods;
        if (categoryId != null) {
            foods = foodItemRepository.findByCategoryIdAndDeletedAtIsNull(categoryId);
        } else if (restaurantId != null) {
            foods = foodItemRepository.findByRestaurantId(restaurantId);
        } else {
            foods = foodItemRepository.findByDeletedAtIsNull();
        }
        return foods.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public FoodResponseDto getFoodById(Integer id) {
        FoodItem food = foodItemRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("Food not found"));
        return mapToDto(food);
    }

    @Override
    @Transactional
    public FoodResponseDto createFood(User user, CreateFoodRequest req) {
        Category category = categoryRepository.findById(req.getCategoryId())
            .orElseThrow(() -> new ResourceNotFoundException("Category not found"));

        if (!user.hasRole("ADMIN") && !category.getRestaurant().getOwner().getId().equals(user.getId())) {
            throw new ForbiddenException("Not authorized to manage this restaurant's foods");
        }

        FoodItem food = FoodItem.builder()
            .category(category)
            .name(req.getName())
            .price(req.getPrice())
            .defaultQuantity(req.getDefaultQuantity() != null ? req.getDefaultQuantity() : 0)
            .currentQuantity(req.getCurrentQuantity() != null ? req.getCurrentQuantity() : (req.getDefaultQuantity() != null ? req.getDefaultQuantity() : 0))
            .isAvailable(req.getIsAvailable() != null ? req.getIsAvailable() : true)
            .imageUrl(req.getImageUrl())
            .build();

        return mapToDto(foodItemRepository.save(food));
    }

    @Override
    @Transactional
    public FoodResponseDto updateFood(User user, Integer id, UpdateFoodRequest req) {
        FoodItem food = foodItemRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("Food not found"));

        if (!user.hasRole("ADMIN") && !food.getCategory().getRestaurant().getOwner().getId().equals(user.getId())) {
            throw new ForbiddenException("Not authorized to manage this restaurant's foods");
        }

        if (req.getCategoryId() != null) {
            Category category = categoryRepository.findById(req.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found"));
            food.setCategory(category);
        }
        if (req.getName() != null) food.setName(req.getName());
        if (req.getPrice() != null) food.setPrice(req.getPrice());
        if (req.getDefaultQuantity() != null) food.setDefaultQuantity(req.getDefaultQuantity());
        if (req.getCurrentQuantity() != null) food.setCurrentQuantity(req.getCurrentQuantity());
        if (req.getIsAvailable() != null) food.setIsAvailable(req.getIsAvailable());
        if (req.getImageUrl() != null) food.setImageUrl(req.getImageUrl());

        return mapToDto(foodItemRepository.save(food));
    }

    @Override
    @Transactional
    public void deleteFood(User user, Integer id) {
        FoodItem food = foodItemRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("Food not found"));

        if (!user.hasRole("ADMIN") && !food.getCategory().getRestaurant().getOwner().getId().equals(user.getId())) {
            throw new ForbiddenException("Not authorized to manage this restaurant's foods");
        }

        food.setDeletedAt(LocalDateTime.now());
        foodItemRepository.save(food);
    }

    private FoodResponseDto mapToDto(FoodItem f) {
        List<ToppingDto.ToppingResponseDto> toppingDtos = (f.getToppings() != null) ? f.getToppings().stream().map(t ->
            ToppingDto.ToppingResponseDto.builder()
                .id(t.getId())
                .restaurantId(t.getRestaurant() != null ? t.getRestaurant().getId() : null)
                .name(t.getName())
                .price(t.getPrice())
                .isAvailable(t.getIsAvailable())
                .build()
        ).collect(Collectors.toList()) : List.of();

        return FoodResponseDto.builder()
            .id(f.getId())
            .categoryId(f.getCategory() != null ? f.getCategory().getId() : null)
            .categoryName(f.getCategory() != null ? f.getCategory().getName() : null)
            .name(f.getName())
            .price(f.getPrice())
            .isAvailable(f.getIsAvailable())
            .defaultQuantity(f.getDefaultQuantity())
            .currentQuantity(f.getCurrentQuantity())
            .imageUrl(f.getImageUrl())
            .toppings(toppingDtos)
            .build();
    }
}
