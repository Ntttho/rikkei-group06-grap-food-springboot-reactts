package com.grabfood.service;

import com.grabfood.dto.ToppingDto.*;
import com.grabfood.entity.User;

import java.util.List;

public interface ToppingService {
    List<ToppingResponseDto> listByRestaurant(Integer restaurantId);
    ToppingResponseDto createTopping(User user, Integer restaurantId, CreateToppingRequest req);
    ToppingResponseDto updateTopping(User user, Integer id, UpdateToppingRequest req);
    void deleteTopping(User user, Integer id);

    List<ToppingResponseDto> listByFood(Integer foodId);
    void assignToFood(User user, Integer foodId, AssignToFoodRequest req);
}
