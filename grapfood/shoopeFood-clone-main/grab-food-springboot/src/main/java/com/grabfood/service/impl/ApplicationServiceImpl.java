package com.grabfood.service.impl;

import com.grabfood.dto.CommonDto.DriverApplicationRequest;
import com.grabfood.dto.CommonDto.MerchantApplicationRequest;
import com.grabfood.entity.DriverDetail;
import com.grabfood.entity.MerchantDetail;
import com.grabfood.entity.Role;
import com.grabfood.entity.User;
import com.grabfood.exception.ResourceNotFoundException;
import com.grabfood.repository.DriverDetailRepository;
import com.grabfood.repository.MerchantDetailRepository;
import com.grabfood.repository.RoleRepository;
import com.grabfood.repository.UserRepository;
import com.grabfood.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final DriverDetailRepository driverDetailRepository;
    private final MerchantDetailRepository merchantDetailRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Override
    public Map<String, Object> getMyApplicationStatus(User user) {
        Map<String, Object> res = new HashMap<>();
        driverDetailRepository.findById(user.getId()).ifPresent(d -> {
            Map<String, Object> driverMap = new HashMap<>();
            driverMap.put("approvalStatus", d.getApprovalStatus());
            driverMap.put("vehicleType", d.getVehicleType());
            driverMap.put("licensePlate", d.getLicensePlate());
            res.put("driver", driverMap);
        });

        merchantDetailRepository.findById(user.getId()).ifPresent(m -> {
            Map<String, Object> merchantMap = new HashMap<>();
            merchantMap.put("businessLicense", m.getBusinessLicense());
            merchantMap.put("taxCode", m.getTaxCode());
            res.put("merchant", merchantMap);
        });

        return res;
    }

    @Override
    @Transactional
    public DriverDetail applyDriver(User user, DriverApplicationRequest req) {
        DriverDetail detail = driverDetailRepository.findById(user.getId())
            .orElseGet(() -> DriverDetail.builder().user(user).userId(user.getId()).build());

        detail.setLicensePlate(req.getLicensePlate());
        detail.setVehicleType(req.getVehicleType());
        detail.setIdCardNumber(req.getIdCardNumber());
        detail.setApprovalStatus("PENDING");

        return driverDetailRepository.save(detail);
    }

    @Override
    @Transactional
    public void applyMerchant(User user, MerchantApplicationRequest req) {
        MerchantDetail detail = merchantDetailRepository.findById(user.getId())
            .orElseGet(() -> MerchantDetail.builder().user(user).userId(user.getId()).build());

        detail.setBusinessLicense(req.getBusinessLicense());
        detail.setTaxCode(req.getTaxCode());

        merchantDetailRepository.save(detail);
    }

    @Override
    public List<DriverDetail> listPendingDrivers() {
        return driverDetailRepository.findByApprovalStatus("PENDING");
    }

    @Override
    @Transactional
    public DriverDetail approveDriver(Integer userId) {
        DriverDetail detail = driverDetailRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Driver detail not found for user: " + userId));

        detail.setApprovalStatus("APPROVED");
        DriverDetail saved = driverDetailRepository.save(detail);

        // Add DRIVER role to user
        User user = detail.getUser();
        Role driverRole = roleRepository.findByName("DRIVER")
            .orElseGet(() -> roleRepository.save(Role.builder().name("DRIVER").build()));
        user.getRoles().add(driverRole);
        userRepository.save(user);

        return saved;
    }

    @Override
    @Transactional
    public DriverDetail rejectDriver(Integer userId) {
        DriverDetail detail = driverDetailRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Driver detail not found for user: " + userId));

        detail.setApprovalStatus("REJECTED");
        return driverDetailRepository.save(detail);
    }
}
