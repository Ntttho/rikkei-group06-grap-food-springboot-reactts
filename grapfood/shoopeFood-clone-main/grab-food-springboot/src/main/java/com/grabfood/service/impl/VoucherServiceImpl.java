package com.grabfood.service.impl;

import com.grabfood.dto.CommonDto.CreateVoucherRequest;
import com.grabfood.dto.CommonDto.ValidateVoucherRequest;
import com.grabfood.entity.Voucher;
import com.grabfood.exception.BadRequestException;
import com.grabfood.exception.ResourceNotFoundException;
import com.grabfood.repository.VoucherRepository;
import com.grabfood.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class VoucherServiceImpl implements VoucherService {

    private final VoucherRepository voucherRepository;

    @Override
    public Voucher validateVoucher(ValidateVoucherRequest req) {
        Voucher voucher = voucherRepository.findByCodeAndIsActiveTrue(req.getCode().trim())
            .orElseThrow(() -> new BadRequestException("Voucher is invalid or inactive"));

        if (voucher.getExpiryDate() != null && voucher.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new BadRequestException("Voucher has expired");
        }

        if (req.getOrderAmount() != null && req.getOrderAmount().compareTo(voucher.getMinOrderValue()) < 0) {
            throw new BadRequestException("Order amount must be at least " + voucher.getMinOrderValue());
        }

        return voucher;
    }

    @Override
    public List<Voucher> getAllVouchers() {
        return voucherRepository.findAll();
    }

    @Override
    public Voucher getVoucherById(Integer id) {
        return voucherRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Voucher not found: " + id));
    }

    @Override
    @Transactional
    public Voucher createVoucher(CreateVoucherRequest req) {
        Voucher voucher = Voucher.builder()
            .code(req.getCode().trim())
            .discountAmount(req.getDiscountAmount())
            .minOrderValue(req.getMinOrderValue() != null ? req.getMinOrderValue() : BigDecimal.ZERO)
            .expiryDate(req.getExpiryDate())
            .isActive(req.getIsActive() != null ? req.getIsActive() : true)
            .build();
        return voucherRepository.save(voucher);
    }

    @Override
    @Transactional
    public Voucher updateVoucher(Integer id, CreateVoucherRequest req) {
        Voucher voucher = getVoucherById(id);
        if (req.getCode() != null) voucher.setCode(req.getCode().trim());
        if (req.getDiscountAmount() != null) voucher.setDiscountAmount(req.getDiscountAmount());
        if (req.getMinOrderValue() != null) voucher.setMinOrderValue(req.getMinOrderValue());
        if (req.getExpiryDate() != null) voucher.setExpiryDate(req.getExpiryDate());
        if (req.getIsActive() != null) voucher.setIsActive(req.getIsActive());
        return voucherRepository.save(voucher);
    }

    @Override
    @Transactional
    public void deleteVoucher(Integer id) {
        voucherRepository.deleteById(id);
    }
}
