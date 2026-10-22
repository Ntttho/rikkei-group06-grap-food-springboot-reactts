package com.grabfood.service.impl;

import com.grabfood.dto.AuthDto.*;
import com.grabfood.entity.Role;
import com.grabfood.entity.User;
import com.grabfood.exception.BadRequestException;
import com.grabfood.exception.UnauthorizedException;
import com.grabfood.repository.RoleRepository;
import com.grabfood.repository.UserRepository;
import com.grabfood.security.CustomPasswordEncoder;
import com.grabfood.security.JwtUtil;
import com.grabfood.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CustomPasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    private final Map<String, String> otpStore = new ConcurrentHashMap<>();

    @Override
    @Transactional
    public AuthResponse login(LoginRequest req) {
        String phone = req.getPhone() != null ? req.getPhone().trim() : "";
        String requestedRole = req.getRole() != null ? req.getRole().trim().toUpperCase() : null;

        User user = userRepository.findByPhone(phone)
            .orElseThrow(() -> new UnauthorizedException("Sai tai khoan hoac mat khau"));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new UnauthorizedException("Sai tai khoan hoac mat khau");
        }

        // If stored password is plaintext or legacy scrypt, upgrade to BCrypt
        if (!user.getPassword().startsWith("$2a$") && !user.getPassword().startsWith("$2b$")) {
            user.setPassword(passwordEncoder.encode(req.getPassword()));
            userRepository.save(user);
        }

        List<String> roleNames = user.getRoles().stream()
            .map(Role::getName)
            .collect(Collectors.toList());

        if (roleNames.isEmpty()) {
            throw new UnauthorizedException("User has no role assigned");
        }

        String activeRole;
        if (requestedRole != null && !requestedRole.isBlank()) {
            if (!roleNames.contains(requestedRole)) {
                throw new UnauthorizedException("Sai tai khoan hoac mat khau");
            }
            activeRole = requestedRole;
        } else {
            activeRole = roleNames.get(0);
        }

        String token = jwtUtil.generateToken(user.getId(), user.getPhone(), activeRole, roleNames);

        return AuthResponse.builder()
            .token(token)
            .user(mapToAuthUserDto(user, activeRole, roleNames))
            .build();
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest req) {
        String phone = req.getPhone() != null ? req.getPhone().trim() : "";
        if (userRepository.existsByPhone(phone)) {
            throw new BadRequestException("Phone number already registered");
        }

        Role customerRole = roleRepository.findByName("CUSTOMER")
            .orElseGet(() -> roleRepository.save(Role.builder().name("CUSTOMER").build()));

        User user = User.builder()
            .fullName(req.getFullName().trim())
            .phone(phone)
            .password(passwordEncoder.encode(req.getPassword()))
            .ratingAvg(new BigDecimal("5.00"))
            .roles(new HashSet<>(Collections.singletonList(customerRole)))
            .build();

        user = userRepository.save(user);

        List<String> roleNames = Collections.singletonList("CUSTOMER");
        String token = jwtUtil.generateToken(user.getId(), user.getPhone(), "CUSTOMER", roleNames);

        return AuthResponse.builder()
            .token(token)
            .user(mapToAuthUserDto(user, "CUSTOMER", roleNames))
            .build();
    }

    @Override
    public AuthUserDto getCurrentUser(User currentUser, String currentRole) {
        List<String> roleNames = currentUser.getRoles().stream()
            .map(Role::getName)
            .collect(Collectors.toList());
        return mapToAuthUserDto(currentUser, currentRole, roleNames);
    }

    @Override
    @Transactional
    public AuthUserDto updateProfile(User currentUser, UpdateProfileRequest req) {
        currentUser.setFullName(req.getFullName().trim());
        currentUser = userRepository.save(currentUser);

        List<String> roleNames = currentUser.getRoles().stream()
            .map(Role::getName)
            .collect(Collectors.toList());
        return mapToAuthUserDto(currentUser, roleNames.isEmpty() ? "CUSTOMER" : roleNames.get(0), roleNames);
    }

    @Override
    @Transactional
    public void changePassword(User currentUser, ChangePasswordRequest req) {
        if (!passwordEncoder.matches(req.getCurrentPassword(), currentUser.getPassword())) {
            throw new BadRequestException("Current password is incorrect");
        }
        currentUser.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(currentUser);
    }

    @Override
    @Transactional
    public AuthResponse activateRole(User currentUser, ActivateRoleRequest req) {
        String roleName = req.getRole().trim().toUpperCase();
        Role role = roleRepository.findByName(roleName)
            .orElseThrow(() -> new BadRequestException("Role not found: " + roleName));

        currentUser.getRoles().add(role);
        currentUser = userRepository.save(currentUser);

        List<String> roleNames = currentUser.getRoles().stream()
            .map(Role::getName)
            .collect(Collectors.toList());

        String token = jwtUtil.generateToken(currentUser.getId(), currentUser.getPhone(), roleName, roleNames);

        return AuthResponse.builder()
            .token(token)
            .user(mapToAuthUserDto(currentUser, roleName, roleNames))
            .build();
    }

    @Override
    public void forgotPassword(ForgotPasswordRequest req) {
        String phone = req.getPhone().trim();
        if (!userRepository.existsByPhone(phone)) {
            throw new BadRequestException("User with phone not found");
        }
        // Demo OTP is 123456
        String otp = "123456";
        otpStore.put(phone, otp);
        log.info("OTP generated for {}: {}", phone, otp);
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest req) {
        String phone = req.getPhone().trim();
        String storedOtp = otpStore.get(phone);
        if (storedOtp == null || !storedOtp.equals(req.getOtp().trim())) {
            throw new BadRequestException("Invalid or expired OTP");
        }

        User user = userRepository.findByPhone(phone)
            .orElseThrow(() -> new BadRequestException("User not found"));

        user.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userRepository.save(user);
        otpStore.remove(phone);
    }

    private AuthUserDto mapToAuthUserDto(User user, String activeRole, List<String> roleNames) {
        String role = activeRole != null ? activeRole : (roleNames.isEmpty() ? "CUSTOMER" : roleNames.get(0));
        return AuthUserDto.builder()
            .id(user.getId())
            .fullName(user.getFullName())
            .phone(user.getPhone())
            .ratingAvg(user.getRatingAvg())
            .roles(Collections.singletonList(role))
            .role(role)
            .createdAt(user.getCreatedAt())
            .build();
    }
}
