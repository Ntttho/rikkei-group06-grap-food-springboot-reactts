package com.grabfood.service.impl;

import com.grabfood.dto.ToppingDto.*;
import com.grabfood.entity.FoodItem;
import com.grabfood.entity.Restaurant;
import com.grabfood.entity.Topping;
import com.grabfood.entity.User;
import com.grabfood.exception.ForbiddenException;
import com.grabfood.exception.ResourceNotFoundException;
import com.grabfood.repository.FoodItemRepository;
import com.grabfood.repository.RestaurantRepository;
import com.grabfood.repository.ToppingRepository;
import com.grabfood.service.ToppingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ToppingServiceImpl implements ToppingService {

    private final ToppingRepository toppingRepository;
    private final RestaurantRepository restaurantRepository;
    private final FoodItemRepository foodItemRepository;

    @Override
    public List<ToppingResponseDto> listByRestaurant(Integer restaurantId) {
        return toppingRepository.findByRestaurantId(restaurantId).stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ToppingResponseDto createTopping(User user, Integer restaurantId, CreateToppingRequest req) {
        Restaurant restaurant = restaurantRepository.findById(restaurantId)
            .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));

        if (!user.hasRole("ADMIN") && !restaurant.getOwner().getId().equals(user.getId())) {
            throw new ForbiddenException("Not authorized to manage this restaurant's toppings");
        }

        Topping topping = Topping.builder()
            .restaurant(restaurant)
            .name(req.getName())
            .price(req.getPrice())
            .isAvailable(req.getIsAvailable() != null ? req.getIsAvailable() : true)
            .build();

        return mapToDto(toppingRepository.save(topping));
    }

    @Override
    @Transactional
    public ToppingResponseDto updateTopping(User user, Integer id, UpdateToppingRequest req) {
        Topping topping = toppingRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Topping not found"));

        if (!user.hasRole("ADMIN") && !topping.getRestaurant().getOwner().getId().equals(user.getId())) {
            throw new ForbiddenException("Not authorized to manage this restaurant's toppings");
        }

        if (req.getName() != null) topping.setName(req.getName());
        if (req.getPrice() != null) topping.setPrice(req.getPrice());
        if (req.getIsAvailable() != null) topping.setIsAvailable(req.getIsAvailable());

        return mapToDto(toppingRepository.save(topping));
    }

    @Override
    @Transactional
    public void deleteTopping(User user, Integer id) {
        Topping topping = toppingRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Topping not found"));

        if (!user.hasRole("ADMIN") && !topping.getRestaurant().getOwner().getId().equals(user.getId())) {
            throw new ForbiddenException("Not authorized to manage this restaurant's toppings");
        }

        toppingRepository.delete(topping);
    }

    @Override
    public List<ToppingResponseDto> listByFood(Integer foodId) {
        return toppingRepository.findByFoodId(foodId).stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void assignToFood(User user, Integer foodId, AssignToFoodRequest req) {
        FoodItem food = foodItemRepository.findById(foodId)
            .orElseThrow(() -> new ResourceNotFoundException("Food not found"));

        if (!user.hasRole("ADMIN") && !food.getCategory().getRestaurant().getOwner().getId().equals(user.getId())) {
            throw new ForbiddenException("Not authorized to manage this food's toppings");
        }

        Topping topping = toppingRepository.findById(req.getToppingId())
            .orElseThrow(() -> new ResourceNotFoundException("Topping not found"));

        food.getToppings().add(topping);
        foodItemRepository.save(food);
    }

    private ToppingResponseDto mapToDto(Topping t) {
        return ToppingResponseDto.builder()
            .id(t.getId())
            .restaurantId(t.getRestaurant() != null ? t.getRestaurant().getId() : null)
            .name(t.getName())
            .price(t.getPrice())
            .isAvailable(t.getIsAvailable())
            .build();
    }
}
