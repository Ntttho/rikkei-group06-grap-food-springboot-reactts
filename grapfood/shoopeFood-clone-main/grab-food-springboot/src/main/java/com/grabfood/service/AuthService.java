package com.grabfood.service;

import com.grabfood.dto.AuthDto.*;
import com.grabfood.entity.User;

public interface AuthService {
    AuthResponse login(LoginRequest req);
    AuthResponse register(RegisterRequest req);
    AuthUserDto getCurrentUser(User currentUser, String currentRole);
    AuthUserDto updateProfile(User currentUser, UpdateProfileRequest req);
    void changePassword(User currentUser, ChangePasswordRequest req);
    AuthResponse activateRole(User currentUser, ActivateRoleRequest req);
    void forgotPassword(ForgotPasswordRequest req);
    void resetPassword(ResetPasswordRequest req);
}
