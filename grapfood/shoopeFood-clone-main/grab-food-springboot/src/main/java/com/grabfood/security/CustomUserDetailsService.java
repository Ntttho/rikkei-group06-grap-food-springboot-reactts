package com.grabfood.security;

import com.grabfood.entity.User;
import com.grabfood.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String phone) throws UsernameNotFoundException {
        User user = userRepository.findByPhone(phone)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with phone: " + phone));
        return new CustomUserDetails(user, null);
    }

    public UserDetails loadUserByPhoneAndRole(String phone, String role) throws UsernameNotFoundException {
        User user = userRepository.findByPhone(phone)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with phone: " + phone));
        return new CustomUserDetails(user, role);
    }
}
