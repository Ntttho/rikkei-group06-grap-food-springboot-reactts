package com.grabfood.repository;

import com.grabfood.entity.FoodItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FoodItemRepository extends JpaRepository<FoodItem, Integer> {
    List<FoodItem> findByCategoryIdAndDeletedAtIsNull(Integer categoryId);

    @Query("SELECT f FROM FoodItem f JOIN f.category c WHERE c.restaurant.id = :restaurantId AND f.deletedAt IS NULL")
    List<FoodItem> findByRestaurantId(@Param("restaurantId") Integer restaurantId);

    Optional<FoodItem> findByIdAndDeletedAtIsNull(Integer id);

    List<FoodItem> findByDeletedAtIsNull();
}
