package com.grabfood.service;

import com.grabfood.dto.CommonDto.CreateSettingRequest;
import com.grabfood.entity.SystemSetting;

import java.util.List;

public interface AdminSettingService {
    List<SystemSetting> getSettings();
    SystemSetting createSetting(CreateSettingRequest req);
    SystemSetting updateSetting(Integer id, CreateSettingRequest req);
    void deleteSetting(Integer id);
}
