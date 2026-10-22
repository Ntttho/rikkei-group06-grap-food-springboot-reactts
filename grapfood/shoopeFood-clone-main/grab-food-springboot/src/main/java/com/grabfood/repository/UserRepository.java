package com.grabfood.repository;

import com.grabfood.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByPhone(String phone);

    boolean existsByPhone(String phone);

    @Query("SELECT DISTINCT u FROM User u JOIN u.roles r WHERE r.name = :roleName AND u.deletedAt IS NULL")
    List<User> findByRoleName(@Param("roleName") String roleName);

    List<User> findByDeletedAtIsNull();
}
