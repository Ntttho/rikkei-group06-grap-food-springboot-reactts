package com.grabfood.repository;

import com.grabfood.entity.UserAddress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserAddressRepository extends JpaRepository<UserAddress, Integer> {
    List<UserAddress> findByUserIdOrderByCreatedAtDesc(Integer userId);
    Optional<UserAddress> findByUserIdAndIsDefaultTrue(Integer userId);
}
