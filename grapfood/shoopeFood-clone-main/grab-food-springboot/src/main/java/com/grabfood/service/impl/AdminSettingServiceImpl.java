package com.grabfood.service.impl;

import com.grabfood.dto.CommonDto.CreateSettingRequest;
import com.grabfood.entity.SystemSetting;
import com.grabfood.exception.ResourceNotFoundException;
import com.grabfood.repository.SystemSettingRepository;
import com.grabfood.service.AdminSettingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminSettingServiceImpl implements AdminSettingService {

    private final SystemSettingRepository settingRepository;

    @Override
    public List<SystemSetting> getSettings() {
        return settingRepository.findAll();
    }

    @Override
    @Transactional
    public SystemSetting createSetting(CreateSettingRequest req) {
        SystemSetting setting = SystemSetting.builder()
            .configKey(req.getConfigKey())
            .configValue(req.getConfigValue())
            .description(req.getDescription())
            .build();
        return settingRepository.save(setting);
    }

    @Override
    @Transactional
    public SystemSetting updateSetting(Integer id, CreateSettingRequest req) {
        SystemSetting setting = settingRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Setting not found: " + id));

        if (req.getConfigKey() != null) setting.setConfigKey(req.getConfigKey());
        if (req.getConfigValue() != null) setting.setConfigValue(req.getConfigValue());
        if (req.getDescription() != null) setting.setDescription(req.getDescription());

        return settingRepository.save(setting);
    }

    @Override
    @Transactional
    public void deleteSetting(Integer id) {
        settingRepository.deleteById(id);
    }
}
