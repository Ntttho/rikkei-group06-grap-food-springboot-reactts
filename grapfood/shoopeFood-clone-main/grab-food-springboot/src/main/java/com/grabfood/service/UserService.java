package com.grabfood.service;

import com.grabfood.dto.AuthDto.AuthUserDto;
import com.grabfood.entity.User;

import java.util.List;
import java.util.Map;

public interface UserService {
    List<AuthUserDto> getUsers();
    AuthUserDto getUserById(Integer id);
    AuthUserDto createUser(Map<String, Object> req);
    AuthUserDto updateUser(Integer id, Map<String, Object> req);
    void deleteUser(Integer id);
    List<AuthUserDto> listMerchants();
    AuthUserDto createMerchant(Map<String, Object> req);
}
