package com.grabfood.controller;

import com.grabfood.dto.ApiResponse;
import com.grabfood.dto.AuthDto.AuthUserDto;
import com.grabfood.security.CustomUserDetails;
import com.grabfood.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthUserDto>> getProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserById(userDetails.getUser().getId())));
    }

    @GetMapping("/merchants")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AuthUserDto>>> listMerchants() {
        return ResponseEntity.ok(ApiResponse.success(userService.listMerchants()));
    }

    @PostMapping("/merchants")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AuthUserDto>> createMerchant(@RequestBody Map<String, Object> req) {
        return ResponseEntity.ok(ApiResponse.success(userService.createMerchant(req)));
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AuthUserDto>>> getUsers() {
        return ResponseEntity.ok(ApiResponse.success(userService.getUsers()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AuthUserDto>> getUserById(@PathVariable Integer id) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserById(id)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AuthUserDto>> createUser(@RequestBody Map<String, Object> req) {
        return ResponseEntity.ok(ApiResponse.success(userService.createUser(req)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AuthUserDto>> updateUser(
        @PathVariable Integer id,
        @RequestBody Map<String, Object> req
    ) {
        return ResponseEntity.ok(ApiResponse.success(userService.updateUser(id, req)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.message("User deleted"));
    }
}
