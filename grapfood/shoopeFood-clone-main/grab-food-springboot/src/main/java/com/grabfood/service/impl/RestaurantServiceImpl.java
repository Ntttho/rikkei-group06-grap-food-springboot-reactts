package com.grabfood.service.impl;

import com.grabfood.dto.CategoryDto;
import com.grabfood.dto.FoodDto;
import com.grabfood.dto.RestaurantDto.*;
import com.grabfood.entity.Category;
import com.grabfood.entity.FoodItem;
import com.grabfood.entity.Restaurant;
import com.grabfood.entity.RestaurantChangeRequest;
import com.grabfood.entity.User;
import com.grabfood.exception.BadRequestException;
import com.grabfood.exception.ForbiddenException;
import com.grabfood.exception.ResourceNotFoundException;
import com.grabfood.repository.CategoryRepository;
import com.grabfood.repository.FoodItemRepository;
import com.grabfood.repository.RestaurantChangeRequestRepository;
import com.grabfood.repository.RestaurantRepository;
import com.grabfood.service.RestaurantService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RestaurantServiceImpl implements RestaurantService {

    private final RestaurantRepository restaurantRepository;
    private final CategoryRepository categoryRepository;
    private final FoodItemRepository foodItemRepository;
    private final RestaurantChangeRequestRepository changeRequestRepository;

    @Override
    public List<RestaurantResponseDto> listPublicRestaurants() {
        return restaurantRepository.findByApprovalStatusAndDeletedAtIsNull("APPROVED").stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Override
    public List<RestaurantResponseDto> listMyRestaurants(User owner) {
        return restaurantRepository.findByOwnerIdAndDeletedAtIsNull(owner.getId()).stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Override
    public RestaurantResponseDto getRestaurantById(Integer id) {
        Restaurant restaurant = restaurantRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
        return mapToDto(restaurant);
    }

    @Override
    @Transactional
    public RestaurantResponseDto createRestaurant(User owner, CreateRestaurantRequest req) {
        Restaurant restaurant = Restaurant.builder()
            .owner(owner)
            .name(req.getName())
            .address(req.getAddress())
            .latitude(req.getLatitude())
            .longitude(req.getLongitude())
            .openingTime(req.getOpeningTime())
            .closingTime(req.getClosingTime())
            .imageUrl(req.getImageUrl())
            .approvalStatus("APPROVED") // Default approved in demo
            .isOpen(true)
            .isOpenToday(true)
            .build();

        return mapToDto(restaurantRepository.save(restaurant));
    }

    @Override
    @Transactional
    public RestaurantResponseDto updateRestaurant(User user, Integer id, UpdateRestaurantRequest req) {
        Restaurant restaurant = findRestaurantAndAssertOwner(user, id);

        if (req.getName() != null) restaurant.setName(req.getName());
        if (req.getAddress() != null) restaurant.setAddress(req.getAddress());
        if (req.getLatitude() != null) restaurant.setLatitude(req.getLatitude());
        if (req.getLongitude() != null) restaurant.setLongitude(req.getLongitude());
        if (req.getOpeningTime() != null) restaurant.setOpeningTime(req.getOpeningTime());
        if (req.getClosingTime() != null) restaurant.setClosingTime(req.getClosingTime());
        if (req.getImageUrl() != null) restaurant.setImageUrl(req.getImageUrl());
        if (req.getIsOpen() != null) restaurant.setIsOpen(req.getIsOpen());
        if (req.getIsOpenToday() != null) restaurant.setIsOpenToday(req.getIsOpenToday());

        return mapToDto(restaurantRepository.save(restaurant));
    }

    @Override
    @Transactional
    public void deleteRestaurant(User user, Integer id) {
        Restaurant restaurant = findRestaurantAndAssertOwner(user, id);
        restaurant.setDeletedAt(LocalDateTime.now());
        restaurantRepository.save(restaurant);
    }

    @Override
    @Transactional
    public RestaurantResponseDto patchStatus(User user, Integer id, PatchStatusRequest req) {
        Restaurant restaurant = findRestaurantAndAssertOwner(user, id);
        if (req.getIsOpen() != null) restaurant.setIsOpen(req.getIsOpen());
        if (req.getIsOpenToday() != null) restaurant.setIsOpenToday(req.getIsOpenToday());
        if (req.getTemporaryClosedReason() != null) restaurant.setTemporaryClosedReason(req.getTemporaryClosedReason());
        return mapToDto(restaurantRepository.save(restaurant));
    }

    @Override
    @Transactional
    public RestaurantResponseDto patchTodayStatus(User user, Integer id, PatchStatusRequest req) {
        Restaurant restaurant = findRestaurantAndAssertOwner(user, id);
        if (req.getIsOpenToday() != null) restaurant.setIsOpenToday(req.getIsOpenToday());
        return mapToDto(restaurantRepository.save(restaurant));
    }

    @Override
    @Transactional
    public RestaurantResponseDto patchLocation(User user, Integer id, PatchLocationRequest req) {
        Restaurant restaurant = findRestaurantAndAssertOwner(user, id);
        restaurant.setLatitude(req.getLatitude());
        restaurant.setLongitude(req.getLongitude());
        return mapToDto(restaurantRepository.save(restaurant));
    }

    @Override
    public List<RestaurantResponseDto> listPendingRestaurants() {
        return restaurantRepository.findByApprovalStatus("PENDING").stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public RestaurantResponseDto approveRestaurant(User admin, Integer id) {
        Restaurant restaurant = restaurantRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
        restaurant.setApprovalStatus("APPROVED");
        restaurant.setApprovedBy(admin);
        restaurant.setApprovedAt(LocalDateTime.now());
        return mapToDto(restaurantRepository.save(restaurant));
    }

    @Override
    @Transactional
    public RestaurantResponseDto rejectRestaurant(User admin, Integer id, RejectRequest req) {
        Restaurant restaurant = restaurantRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
        restaurant.setApprovalStatus("REJECTED");
        restaurant.setRejectReason(req.getReason());
        return mapToDto(restaurantRepository.save(restaurant));
    }

    @Override
    public List<RestaurantChangeRequest> listChangeRequests() {
        return changeRequestRepository.findByStatus("PENDING");
    }

    @Override
    @Transactional
    public void approveChangeRequest(User admin, Integer id) {
        RestaurantChangeRequest cr = changeRequestRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Change request not found"));
        cr.setStatus("APPROVED");
        cr.setReviewedBy(admin);
        cr.setReviewedAt(LocalDateTime.now());
        changeRequestRepository.save(cr);
    }

    @Override
    @Transactional
    public void rejectChangeRequest(User admin, Integer id, RejectRequest req) {
        RestaurantChangeRequest cr = changeRequestRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Change request not found"));
        cr.setStatus("REJECTED");
        cr.setReviewedBy(admin);
        cr.setReviewedAt(LocalDateTime.now());
        cr.setRejectReason(req != null ? req.getReason() : null);
        changeRequestRepository.save(cr);
    }

    private Restaurant findRestaurantAndAssertOwner(User user, Integer id) {
        Restaurant restaurant = restaurantRepository.findByIdAndDeletedAtIsNull(id)
            .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found"));
        if (!user.hasRole("ADMIN") && !restaurant.getOwner().getId().equals(user.getId())) {
            throw new ForbiddenException("You do not own this restaurant");
        }
        return restaurant;
    }

    private RestaurantResponseDto mapToDto(Restaurant r) {
        List<Category> categories = categoryRepository.findByRestaurantId(r.getId());
        List<CategoryDto.CategoryResponseDto> categoryDtos = categories.stream().map(c -> {
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

            return CategoryDto.CategoryResponseDto.builder()
                .id(c.getId())
                .restaurantId(r.getId())
                .name(c.getName())
                .foods(foodDtos)
                .build();
        }).collect(Collectors.toList());

        return RestaurantResponseDto.builder()
            .id(r.getId())
            .ownerId(r.getOwner() != null ? r.getOwner().getId() : null)
            .ownerName(r.getOwner() != null ? r.getOwner().getFullName() : null)
            .name(r.getName())
            .address(r.getAddress())
            .latitude(r.getLatitude())
            .longitude(r.getLongitude())
            .openingTime(r.getOpeningTime())
            .closingTime(r.getClosingTime())
            .isOpen(r.getIsOpen())
            .isOpenToday(r.getIsOpenToday())
            .temporaryClosedReason(r.getTemporaryClosedReason())
            .imageUrl(r.getImageUrl())
            .ratingAvg(r.getRatingAvg())
            .approvalStatus(r.getApprovalStatus())
            .categories(categoryDtos)
            .build();
    }
}
