package com.grabfood.repository;

import com.grabfood.entity.Topping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ToppingRepository extends JpaRepository<Topping, Integer> {
    List<Topping> findByRestaurantId(Integer restaurantId);

    @Query("SELECT t FROM FoodItem f JOIN f.toppings t WHERE f.id = :foodId")
    List<Topping> findByFoodId(@Param("foodId") Integer foodId);
}
