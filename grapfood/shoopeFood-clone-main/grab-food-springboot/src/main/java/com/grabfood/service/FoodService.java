package com.grabfood.service;

import com.grabfood.dto.FoodDto.*;
import com.grabfood.entity.User;

import java.util.List;

public interface FoodService {
    List<FoodResponseDto> getAllFoods(Integer categoryId, Integer restaurantId);
    FoodResponseDto getFoodById(Integer id);
    FoodResponseDto createFood(User user, CreateFoodRequest req);
    FoodResponseDto updateFood(User user, Integer id, UpdateFoodRequest req);
    void deleteFood(User user, Integer id);
}
