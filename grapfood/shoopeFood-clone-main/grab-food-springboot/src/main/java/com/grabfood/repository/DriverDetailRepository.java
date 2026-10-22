package com.grabfood.repository;

import com.grabfood.entity.DriverDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DriverDetailRepository extends JpaRepository<DriverDetail, Integer> {
    List<DriverDetail> findByApprovalStatus(String approvalStatus);
    List<DriverDetail> findByIsOnlineTrue();
}
