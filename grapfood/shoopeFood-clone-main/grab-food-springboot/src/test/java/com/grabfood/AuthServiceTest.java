package com.grabfood;

import com.grabfood.dto.AuthDto.LoginRequest;
import com.grabfood.entity.Role;
import com.grabfood.entity.User;
import com.grabfood.exception.UnauthorizedException;
import com.grabfood.repository.RoleRepository;
import com.grabfood.repository.UserRepository;
import com.grabfood.security.CustomPasswordEncoder;
import com.grabfood.security.JwtUtil;
import com.grabfood.service.impl.AuthServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private CustomPasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthServiceImpl authService;

    private User sampleUser;
    private Role customerRole;

    @BeforeEach
    void setUp() {
        customerRole = Role.builder().id(1).name("CUSTOMER").build();
        sampleUser = User.builder()
            .id(1)
            .phone("0901234567")
            .password("$2a$10$encryptedpassword")
            .fullName("Nguyen Van A")
            .ratingAvg(new BigDecimal("5.00"))
            .roles(new HashSet<>(Collections.singletonList(customerRole)))
            .build();
    }

    @Test
    @DisplayName("Should successfully login with valid credentials")
    void login_Success() {
        LoginRequest req = LoginRequest.builder()
            .phone("0901234567")
            .password("123456")
            .role("CUSTOMER")
            .build();

        when(userRepository.findByPhone("0901234567")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("123456", sampleUser.getPassword())).thenReturn(true);
        when(jwtUtil.generateToken(any(), anyString(), anyString(), any())).thenReturn("mock-jwt-token");

        var response = authService.login(req);

        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo("mock-jwt-token");
        assertThat(response.getUser().getPhone()).isEqualTo("0901234567");
    }

    @Test
    @DisplayName("Should throw UnauthorizedException when password is wrong")
    void login_WrongPassword() {
        LoginRequest req = LoginRequest.builder()
            .phone("0901234567")
            .password("wrongpassword")
            .role("CUSTOMER")
            .build();

        when(userRepository.findByPhone("0901234567")).thenReturn(Optional.of(sampleUser));
        when(passwordEncoder.matches("wrongpassword", sampleUser.getPassword())).thenReturn(false);

        assertThrows(UnauthorizedException.class, () -> authService.login(req));
    }

    @Test
    @DisplayName("Should throw UnauthorizedException when user does not exist")
    void login_UserNotFound() {
        LoginRequest req = LoginRequest.builder()
            .phone("0999999999")
            .password("123456")
            .role("CUSTOMER")
            .build();

        when(userRepository.findByPhone("0999999999")).thenReturn(Optional.empty());

        assertThrows(UnauthorizedException.class, () -> authService.login(req));
    }
}
