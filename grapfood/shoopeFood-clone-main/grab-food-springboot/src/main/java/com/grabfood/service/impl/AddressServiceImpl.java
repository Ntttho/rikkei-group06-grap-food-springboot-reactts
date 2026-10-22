package com.grabfood.service.impl;

import com.grabfood.dto.CommonDto.CreateAddressRequest;
import com.grabfood.entity.User;
import com.grabfood.entity.UserAddress;
import com.grabfood.exception.ForbiddenException;
import com.grabfood.exception.ResourceNotFoundException;
import com.grabfood.repository.UserAddressRepository;
import com.grabfood.service.AddressService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AddressServiceImpl implements AddressService {

    private final UserAddressRepository addressRepository;

    @Override
    public List<Map<String, Object>> suggest(String query) {
        // Mock suggestion matching common HCM places
        List<Map<String, Object>> list = new ArrayList<>();
        Map<String, Object> item1 = new HashMap<>();
        item1.put("placeId", "demo-place-1");
        item1.put("description", "Landmark 81, Vinhomes Central Park, Binh Thanh, HCMC");
        item1.put("latitude", 10.7951);
        item1.put("longitude", 106.7218);
        list.add(item1);

        Map<String, Object> item2 = new HashMap<>();
        item2.put("placeId", "demo-place-2");
        item2.put("description", "Bitexco Financial Tower, District 1, HCMC");
        item2.put("latitude", 10.7719);
        item2.put("longitude", 106.7044);
        list.add(item2);

        return list;
    }

    @Override
    public Map<String, Object> detail(String placeId) {
        Map<String, Object> res = new HashMap<>();
        res.put("placeId", placeId);
        res.put("address", "123 Nguyen Hue, Ben Nghe, District 1, HCMC");
        res.put("latitude", 10.7743);
        res.put("longitude", 106.7037);
        return res;
    }

    @Override
    public Map<String, Object> reverse(Double lat, Double lng) {
        Map<String, Object> res = new HashMap<>();
        res.put("address", "Vinhomes Central Park, Ward 22, Binh Thanh, HCMC");
        res.put("latitude", lat != null ? lat : 10.7951);
        res.put("longitude", lng != null ? lng : 106.7218);
        return res;
    }

    @Override
    public List<UserAddress> listMine(User user) {
        return addressRepository.findByUserIdOrderByCreatedAtDesc(user.getId());
    }

    @Override
    @Transactional
    public UserAddress createMine(User user, CreateAddressRequest req) {
        if (Boolean.TRUE.equals(req.getIsDefault())) {
            addressRepository.findByUserIdAndIsDefaultTrue(user.getId())
                .ifPresent(old -> {
                    old.setIsDefault(false);
                    addressRepository.save(old);
                });
        }

        UserAddress address = UserAddress.builder()
            .user(user)
            .address(req.getAddress())
            .latitude(req.getLatitude())
            .longitude(req.getLongitude())
            .isDefault(Boolean.TRUE.equals(req.getIsDefault()))
            .label(req.getLabel())
            .createdAt(LocalDateTime.now())
            .build();

        return addressRepository.save(address);
    }

    @Override
    @Transactional
    public UserAddress updateMine(User user, Integer id, CreateAddressRequest req) {
        UserAddress address = addressRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("Cannot modify address of another user");
        }

        if (Boolean.TRUE.equals(req.getIsDefault())) {
            addressRepository.findByUserIdAndIsDefaultTrue(user.getId())
                .ifPresent(old -> {
                    old.setIsDefault(false);
                    addressRepository.save(old);
                });
        }

        if (req.getAddress() != null) address.setAddress(req.getAddress());
        if (req.getLatitude() != null) address.setLatitude(req.getLatitude());
        if (req.getLongitude() != null) address.setLongitude(req.getLongitude());
        if (req.getIsDefault() != null) address.setIsDefault(req.getIsDefault());
        if (req.getLabel() != null) address.setLabel(req.getLabel());

        return addressRepository.save(address);
    }

    @Override
    @Transactional
    public void deleteMine(User user, Integer id) {
        UserAddress address = addressRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Address not found"));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new ForbiddenException("Cannot delete address of another user");
        }

        addressRepository.delete(address);
    }
}
