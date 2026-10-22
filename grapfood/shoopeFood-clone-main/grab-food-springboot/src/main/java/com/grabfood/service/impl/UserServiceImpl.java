package com.grabfood.service.impl;

import com.grabfood.dto.AuthDto.AuthUserDto;
import com.grabfood.entity.MerchantDetail;
import com.grabfood.entity.Role;
import com.grabfood.entity.User;
import com.grabfood.exception.BadRequestException;
import com.grabfood.exception.ResourceNotFoundException;
import com.grabfood.repository.MerchantDetailRepository;
import com.grabfood.repository.RoleRepository;
import com.grabfood.repository.UserRepository;
import com.grabfood.security.CustomPasswordEncoder;
import com.grabfood.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final MerchantDetailRepository merchantDetailRepository;
    private final CustomPasswordEncoder passwordEncoder;

    @Override
    public List<AuthUserDto> getUsers() {
        return userRepository.findByDeletedAtIsNull().stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Override
    public AuthUserDto getUserById(Integer id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        return mapToDto(user);
    }

    @Override
    @Transactional
    public AuthUserDto createUser(Map<String, Object> req) {
        String phone = String.valueOf(req.get("phone"));
        if (userRepository.existsByPhone(phone)) {
            throw new BadRequestException("Phone already in use");
        }

        String rawPassword = req.get("password") != null ? String.valueOf(req.get("password")) : "123456";
        String fullName = req.get("fullName") != null ? String.valueOf(req.get("fullName")) : "";
        String roleName = req.get("role") != null ? String.valueOf(req.get("role")).toUpperCase() : "CUSTOMER";

        Role role = roleRepository.findByName(roleName)
            .orElseGet(() -> roleRepository.save(Role.builder().name(roleName).build()));

        User user = User.builder()
            .phone(phone)
            .password(passwordEncoder.encode(rawPassword))
            .fullName(fullName)
            .ratingAvg(new BigDecimal("5.00"))
            .roles(new HashSet<>(Collections.singletonList(role)))
            .build();

        return mapToDto(userRepository.save(user));
    }

    @Override
    @Transactional
    public AuthUserDto updateUser(Integer id, Map<String, Object> req) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));

        if (req.get("fullName") != null) user.setFullName(String.valueOf(req.get("fullName")));
        if (req.get("password") != null) user.setPassword(passwordEncoder.encode(String.valueOf(req.get("password"))));

        return mapToDto(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deleteUser(Integer id) {
        User user = userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
        user.setDeletedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    @Override
    public List<AuthUserDto> listMerchants() {
        return userRepository.findByRoleName("MERCHANT").stream()
            .map(this::mapToDto)
            .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public AuthUserDto createMerchant(Map<String, Object> req) {
        req.put("role", "MERCHANT");
        AuthUserDto dto = createUser(req);

        User user = userRepository.findById(dto.getId()).orElse(null);
        if (user != null) {
            String license = req.get("businessLicense") != null ? String.valueOf(req.get("businessLicense")) : null;
            String tax = req.get("taxCode") != null ? String.valueOf(req.get("taxCode")) : null;
            merchantDetailRepository.save(MerchantDetail.builder()
                .user(user)
                .userId(user.getId())
                .businessLicense(license)
                .taxCode(tax)
                .build());
        }

        return dto;
    }

    private AuthUserDto mapToDto(User u) {
        List<String> roles = u.getRoles().stream().map(Role::getName).collect(Collectors.toList());
        return AuthUserDto.builder()
            .id(u.getId())
            .phone(u.getPhone())
            .fullName(u.getFullName())
            .ratingAvg(u.getRatingAvg())
            .roles(roles)
            .role(roles.isEmpty() ? "CUSTOMER" : roles.get(0))
            .createdAt(u.getCreatedAt())
            .build();
    }
}
