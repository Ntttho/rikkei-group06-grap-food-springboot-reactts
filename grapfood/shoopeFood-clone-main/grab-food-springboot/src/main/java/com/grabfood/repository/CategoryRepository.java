package com.grabfood.repository;

import com.grabfood.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    List<Category> findByRestaurantId(Integer restaurantId);
    Optional<Category> findByIdAndRestaurantId(Integer id, Integer restaurantId);
}
