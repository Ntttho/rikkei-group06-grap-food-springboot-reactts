package com.grabfood.service;

import com.grabfood.dto.CommonDto.DriverApplicationRequest;
import com.grabfood.dto.CommonDto.MerchantApplicationRequest;
import com.grabfood.entity.DriverDetail;
import com.grabfood.entity.User;

import java.util.List;
import java.util.Map;

public interface ApplicationService {
    Map<String, Object> getMyApplicationStatus(User user);
    DriverDetail applyDriver(User user, DriverApplicationRequest req);
    void applyMerchant(User user, MerchantApplicationRequest req);
    List<DriverDetail> listPendingDrivers();
    DriverDetail approveDriver(Integer userId);
    DriverDetail rejectDriver(Integer userId);
}
