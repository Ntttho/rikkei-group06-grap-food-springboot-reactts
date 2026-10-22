package com.grabfood.security;

import com.grabfood.entity.User;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.stream.Collectors;

@Getter
public class CustomUserDetails implements UserDetails {

    private final User user;
    private final String currentRole;

    public CustomUserDetails(User user, String currentRole) {
        this.user = user;
        this.currentRole = currentRole;
    }

    public Integer getId() {
        return user.getId();
    }

    public String getPhone() {
        return user.getPhone();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (currentRole != null && !currentRole.isBlank()) {
            return java.util.List.of(new SimpleGrantedAuthority("ROLE_" + currentRole.toUpperCase()));
        }
        return user.getRoles().stream()
            .map(r -> new SimpleGrantedAuthority("ROLE_" + r.getName().toUpperCase()))
            .collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getPhone();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return user.getDeletedAt() == null;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return user.getDeletedAt() == null;
    }
}
