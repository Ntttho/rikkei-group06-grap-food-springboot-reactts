package com.grabfood.service;

import com.grabfood.dto.CommonDto.CreateVoucherRequest;
import com.grabfood.dto.CommonDto.ValidateVoucherRequest;
import com.grabfood.entity.Voucher;

import java.util.List;

public interface VoucherService {
    Voucher validateVoucher(ValidateVoucherRequest req);
    List<Voucher> getAllVouchers();
    Voucher getVoucherById(Integer id);
    Voucher createVoucher(CreateVoucherRequest req);
    Voucher updateVoucher(Integer id, CreateVoucherRequest req);
    void deleteVoucher(Integer id);
}
