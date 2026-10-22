package com.grabfood.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "merchant_details")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MerchantDetail {
    @Id
    @Column(name = "user_id")
    private Integer userId;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "business_license", length = 100)
    private String businessLicense;

    @Column(name = "tax_code", length = 50)
    private String taxCode;
}
