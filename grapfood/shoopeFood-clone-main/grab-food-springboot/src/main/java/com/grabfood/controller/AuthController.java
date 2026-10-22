package com.grabfood.controller;

import com.grabfood.dto.ApiResponse;
import com.grabfood.dto.AuthDto.*;
import com.grabfood.security.CustomUserDetails;
import com.grabfood.service.AuthService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
        @Valid @RequestBody LoginRequest req,
        HttpServletResponse response
    ) {
        AuthResponse authRes = authService.login(req);
        Cookie cookie = new Cookie("token", authRes.getToken());
        cookie.setHttpOnly(true);
        cookie.setMaxAge(86400);
        cookie.setPath("/");
        response.addCookie(cookie);

        return ResponseEntity.ok(ApiResponse.success("Logged in", authRes));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest req) {
        AuthResponse authRes = authService.register(req);
        return ResponseEntity.ok(ApiResponse.success("Registered", authRes));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthUserDto>> me(@AuthenticationPrincipal CustomUserDetails userDetails) {
        AuthUserDto user = authService.getCurrentUser(userDetails.getUser(), userDetails.getCurrentRole());
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<AuthUserDto>> updateProfile(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @Valid @RequestBody UpdateProfileRequest req
    ) {
        AuthUserDto user = authService.updateProfile(userDetails.getUser(), req);
        return ResponseEntity.ok(ApiResponse.success(user));
    }

    @PutMapping("/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @Valid @RequestBody ChangePasswordRequest req
    ) {
        authService.changePassword(userDetails.getUser(), req);
        return ResponseEntity.ok(ApiResponse.message("Password updated successfully"));
    }

    @PostMapping("/activate-role")
    public ResponseEntity<ApiResponse<AuthResponse>> activateRole(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @Valid @RequestBody ActivateRoleRequest req
    ) {
        AuthResponse res = authService.activateRole(userDetails.getUser(), req);
        return ResponseEntity.ok(ApiResponse.success(res));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest req) {
        authService.forgotPassword(req);
        return ResponseEntity.ok(ApiResponse.message("OTP sent to your phone"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest req) {
        authService.resetPassword(req);
        return ResponseEntity.ok(ApiResponse.message("Password reset successfully"));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("token", null);
        cookie.setHttpOnly(true);
        cookie.setMaxAge(0);
        cookie.setPath("/");
        response.addCookie(cookie);
        return ResponseEntity.ok(ApiResponse.message("Logged out"));
    }
}
