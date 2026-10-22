package com.grabfood.service;

import com.grabfood.dto.RestaurantDto.*;
import com.grabfood.entity.Restaurant;
import com.grabfood.entity.RestaurantChangeRequest;
import com.grabfood.entity.User;

import java.util.List;

public interface RestaurantService {
    List<RestaurantResponseDto> listPublicRestaurants();
    List<RestaurantResponseDto> listMyRestaurants(User owner);
    RestaurantResponseDto getRestaurantById(Integer id);
    RestaurantResponseDto createRestaurant(User owner, CreateRestaurantRequest req);
    RestaurantResponseDto updateRestaurant(User user, Integer id, UpdateRestaurantRequest req);
    void deleteRestaurant(User user, Integer id);

    RestaurantResponseDto patchStatus(User user, Integer id, PatchStatusRequest req);
    RestaurantResponseDto patchTodayStatus(User user, Integer id, PatchStatusRequest req);
    RestaurantResponseDto patchLocation(User user, Integer id, PatchLocationRequest req);

    List<RestaurantResponseDto> listPendingRestaurants();
    RestaurantResponseDto approveRestaurant(User admin, Integer id);
    RestaurantResponseDto rejectRestaurant(User admin, Integer id, RejectRequest req);

    List<RestaurantChangeRequest> listChangeRequests();
    void approveChangeRequest(User admin, Integer id);
    void rejectChangeRequest(User admin, Integer id, RejectRequest req);
}
