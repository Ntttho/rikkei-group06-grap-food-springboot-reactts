package com.grabfood.repository;

import com.grabfood.entity.MerchantDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MerchantDetailRepository extends JpaRepository<MerchantDetail, Integer> {
}
