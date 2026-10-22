package com.grabfood.service;

import com.grabfood.dto.CommonDto.CreateAddressRequest;
import com.grabfood.entity.User;
import com.grabfood.entity.UserAddress;

import java.util.List;
import java.util.Map;

public interface AddressService {
    List<Map<String, Object>> suggest(String query);
    Map<String, Object> detail(String placeId);
    Map<String, Object> reverse(Double lat, Double lng);
    List<UserAddress> listMine(User user);
    UserAddress createMine(User user, CreateAddressRequest req);
    UserAddress updateMine(User user, Integer id, CreateAddressRequest req);
    void deleteMine(User user, Integer id);
}
