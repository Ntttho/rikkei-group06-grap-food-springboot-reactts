package com.grabfood.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "restaurants")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Restaurant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(nullable = false)
    @Builder.Default
    private Double latitude = 0.0;

    @Column(nullable = false)
    @Builder.Default
    private Double longitude = 0.0;

    @Column(name = "opening_time")
    @Builder.Default
    private LocalTime openingTime = LocalTime.of(7, 0);

    @Column(name = "closing_time")
    @Builder.Default
    private LocalTime closingTime = LocalTime.of(22, 0);

    @Column(name = "is_open")
    @Builder.Default
    private Boolean isOpen = true;

    @Column(name = "is_open_today", nullable = false)
    @Builder.Default
    private Boolean isOpenToday = true;

    @Column(name = "temporary_closed_reason", columnDefinition = "TEXT")
    private String temporaryClosedReason;

    @Column(name = "temporary_closed_until")
    private LocalDateTime temporaryClosedUntil;

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @Column(name = "rating_avg", precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal ratingAvg = new BigDecimal("5.00");

    @Column(name = "approval_status", length = 20)
    @Builder.Default
    private String approvalStatus = "APPROVED";

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private User approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "reject_reason", columnDefinition = "TEXT")
    private String rejectReason;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;
}
