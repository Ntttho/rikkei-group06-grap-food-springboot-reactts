package com.grabfood.repository;

import com.grabfood.entity.Restaurant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Integer> {
    List<Restaurant> findByApprovalStatusAndDeletedAtIsNull(String approvalStatus);

    List<Restaurant> findByOwnerIdAndDeletedAtIsNull(Integer ownerId);

    Optional<Restaurant> findByIdAndOwnerIdAndDeletedAtIsNull(Integer id, Integer ownerId);

    List<Restaurant> findByApprovalStatus(String approvalStatus);

    Optional<Restaurant> findByIdAndDeletedAtIsNull(Integer id);
}
