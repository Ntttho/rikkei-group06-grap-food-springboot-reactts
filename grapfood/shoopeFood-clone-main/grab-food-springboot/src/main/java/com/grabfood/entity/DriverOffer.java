package com.grabfood.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "driver_offers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DriverOffer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_id", nullable = false)
    private Long orderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "driver_id", nullable = false)
    private User driver;

    @Column(nullable = false, length = 30)
    private String status;

    @Column(length = 50)
    private String algorithm;

    @Column(name = "search_radius_km")
    private Double searchRadiusKm;

    @Column(name = "distance_km")
    private Double distanceKm;

    @Column(name = "pickup_eta_minutes")
    private Double pickupEtaMinutes;

    @Column(name = "dispatch_score")
    private Double dispatchScore;

    @Column(name = "offered_at", nullable = false)
    private LocalDateTime offeredAt;

    @Column(name = "responded_at")
    private LocalDateTime respondedAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "response_reason", columnDefinition = "TEXT")
    private String responseReason;

    @Column(name = "cancellation_chargeable", nullable = false)
    @Builder.Default
    private Boolean cancellationChargeable = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
