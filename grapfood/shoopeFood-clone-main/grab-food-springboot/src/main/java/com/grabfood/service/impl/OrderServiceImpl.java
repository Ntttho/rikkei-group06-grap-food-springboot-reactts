package com.grabfood.service.impl;

import com.grabfood.dto.OrderDto.*;
import com.grabfood.entity.*;
import com.grabfood.exception.BadRequestException;
import com.grabfood.exception.ConflictException;
import com.grabfood.exception.ForbiddenException;
import com.grabfood.exception.ResourceNotFoundException;
import com.grabfood.repository.*;
import com.grabfood.service.OrderService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final OrderItemToppingRepository orderItemToppingRepository;
    private final OrderStatusRepository orderStatusRepository;
    private final OrderStatusLogRepository orderStatusLogRepository;
    private final RestaurantRepository restaurantRepository;
    private final FoodItemRepository foodItemRepository;
    private final ToppingRepository toppingRepository;
    private final VoucherRepository voucherRepository;
    private final PaymentRepository paymentRepository;
    private final DriverOfferRepository driverOfferRepository;

    private static final String DEFAULT_STATUS = "PENDING";
    private static final BigDecimal DEFAULT_SHIPPING_BASE_FEE = new BigDecimal("20000");

    @Override
    @Transactional
    public OrderResponseDto createOrder(User customer, CreateOrderRequest req) {
        if (!customer.hasRole("CUSTOMER") && !customer.hasRole("ADMIN")) {
            throw new ForbiddenException("Only CUSTOMER accounts can create orders");
        }

        // Idempotency check
        if (req.getIdempotencyKey() != null && !req.getIdempotencyKey().isBlank()) {
            Optional<Order> existing = orderRepository.findByIdempotencyKey(req.getIdempotencyKey());
            if (existing.isPresent()) {
                log.info("Duplicate order with idempotency key: {}", req.getIdempotencyKey());
                return mapToDto(existing.get());
            }
        }

        Restaurant restaurant = restaurantRepository.findByIdAndDeletedAtIsNull(req.getRestaurantId())
            .orElseThrow(() -> new BadRequestException("Restaurant not found"));

        if (!Boolean.TRUE.equals(restaurant.getIsOpen()) || !"APPROVED".equalsIgnoreCase(restaurant.getApprovalStatus())) {
            throw new BadRequestException("Restaurant is not accepting orders");
        }

        OrderStatus pendingStatus = orderStatusRepository.findByCode(DEFAULT_STATUS)
            .orElseThrow(() -> new BadRequestException("Order status PENDING not configured in DB"));

        // Process Items & Inventory
        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> preparedItems = new ArrayList<>();
        List<List<OrderItemTopping>> preparedItemToppings = new ArrayList<>();

        if (req.getItems() == null || req.getItems().isEmpty()) {
            throw new BadRequestException("Order items must not be empty");
        }

        for (OrderItemRequest itemReq : req.getItems()) {
            FoodItem food = foodItemRepository.findByIdAndDeletedAtIsNull(itemReq.getFoodId())
                .orElseThrow(() -> new BadRequestException("Food item not found: " + itemReq.getFoodId()));

            if (food.getCategory() == null || !food.getCategory().getRestaurant().getId().equals(restaurant.getId())) {
                throw new BadRequestException("Food #" + itemReq.getFoodId() + " does not belong to this restaurant");
            }

            if (!Boolean.TRUE.equals(food.getIsAvailable())) {
                throw new BadRequestException("Food " + food.getName() + " is currently unavailable");
            }

            if (food.getCurrentQuantity() < itemReq.getQuantity()) {
                throw new ConflictException("Đồ ăn không đủ. Món " + food.getName() + " hiện chỉ còn " + food.getCurrentQuantity() + " phần.");
            }

            // Deduct stock
            food.setCurrentQuantity(food.getCurrentQuantity() - itemReq.getQuantity());
            foodItemRepository.save(food);

            BigDecimal itemTotal = food.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));
            subtotal = subtotal.add(itemTotal);

            OrderItem orderItem = OrderItem.builder()
                .food(food)
                .foodName(food.getName())
                .quantity(itemReq.getQuantity())
                .priceAtOrder(food.getPrice())
                .build();
            preparedItems.add(orderItem);

            // Process Toppings
            List<OrderItemTopping> itemToppings = new ArrayList<>();
            if (itemReq.getToppings() != null) {
                for (ToppingItemRequest toppingReq : itemReq.getToppings()) {
                    Topping topping = toppingRepository.findById(toppingReq.getId())
                        .orElseThrow(() -> new BadRequestException("Topping not found: " + toppingReq.getId()));

                    if (!Boolean.TRUE.equals(topping.getIsAvailable())) {
                        throw new BadRequestException("Topping " + topping.getName() + " is out of stock");
                    }

                    BigDecimal toppingCost = topping.getPrice().multiply(BigDecimal.valueOf(toppingReq.getQuantity()));
                    subtotal = subtotal.add(toppingCost);

                    OrderItemTopping oit = OrderItemTopping.builder()
                        .topping(topping)
                        .quantity(toppingReq.getQuantity())
                        .price(topping.getPrice())
                        .build();
                    itemToppings.add(oit);
                }
            }
            preparedItemToppings.add(itemToppings);
        }

        // Voucher discount
        BigDecimal discount = BigDecimal.ZERO;
        Voucher voucher = null;
        if (req.getVoucherId() != null) {
            voucher = voucherRepository.findById(req.getVoucherId()).orElse(null);
            if (voucher != null && Boolean.TRUE.equals(voucher.getIsActive())) {
                if (subtotal.compareTo(voucher.getMinOrderValue()) >= 0) {
                    discount = voucher.getDiscountAmount();
                }
            }
        } else if (req.getDiscountAmount() != null) {
            discount = req.getDiscountAmount();
        }

        // Distance & Shipping fee
        double distance = (req.getDistanceKm() != null && req.getDistanceKm() > 0) ? req.getDistanceKm() : 2.0;
        BigDecimal baseFee = req.getBaseFee() != null ? req.getBaseFee() : DEFAULT_SHIPPING_BASE_FEE;
        BigDecimal shippingFee = baseFee;
        if (distance > 2.0) {
            double extraKm = distance - 2.0;
            BigDecimal extraFee = BigDecimal.valueOf(extraKm * 5000).setScale(0, RoundingMode.HALF_UP);
            shippingFee = shippingFee.add(extraFee);
        }

        BigDecimal tax = req.getTaxAmount() != null ? req.getTaxAmount() : BigDecimal.ZERO;
        BigDecimal total = subtotal.add(shippingFee).add(tax).subtract(discount);
        if (total.compareTo(BigDecimal.ZERO) < 0) total = BigDecimal.ZERO;

        String orderCode = (req.getOrderCode() != null && !req.getOrderCode().isBlank())
            ? req.getOrderCode()
            : "ORD-" + System.currentTimeMillis() + "-" + (new Random().nextInt(9000) + 1000);

        String idempotencyKey = (req.getIdempotencyKey() != null && !req.getIdempotencyKey().isBlank())
            ? req.getIdempotencyKey()
            : UUID.randomUUID().toString();

        Order order = Order.builder()
            .orderCode(orderCode)
            .idempotencyKey(idempotencyKey)
            .customer(customer)
            .restaurant(restaurant)
            .voucher(voucher)
            .receiverAddress(req.getReceiverAddress())
            .receiverLat(req.getReceiverLat())
            .receiverLng(req.getReceiverLng())
            .distanceKm(distance)
            .subtotalAmount(subtotal)
            .taxAmount(tax)
            .shippingFee(shippingFee)
            .discountAmount(discount)
            .totalAmount(total)
            .status(pendingStatus)
            .version(0)
            .createdAt(LocalDateTime.now())
            .build();

        Order savedOrder = orderRepository.save(order);

        // Save order items & toppings
        for (int i = 0; i < preparedItems.size(); i++) {
            OrderItem oi = preparedItems.get(i);
            oi.setOrder(savedOrder);
            OrderItem savedItem = orderItemRepository.save(oi);

            List<OrderItemTopping> toppings = preparedItemToppings.get(i);
            for (OrderItemTopping oit : toppings) {
                oit.setOrderItem(savedItem);
                orderItemToppingRepository.save(oit);
            }
        }

        // Log status change
        orderStatusLogRepository.save(OrderStatusLog.builder()
            .orderId(savedOrder.getId())
            .previousStatus(null)
            .newStatus(DEFAULT_STATUS)
            .changedBy(customer)
            .reason("Order created")
            .build());

        // Create initial Payment record
        paymentRepository.save(Payment.builder()
            .order(savedOrder)
            .idempotencyKey(UUID.randomUUID().toString())
            .paymentMethod("CASH")
            .status("PENDING")
            .amount(total)
            .build());

        return mapToDto(savedOrder);
    }

    @Override
    public List<OrderResponseDto> getOrders(User user, String status, Integer restaurantId, Integer driverId, Integer customerId) {
        List<Order> orders;

        if (user.hasRole("ADMIN")) {
            orders = orderRepository.findAllOrdersDesc();
        } else if (user.hasRole("DRIVER")) {
            orders = orderRepository.findByDriverIdOrderByCreatedAtDesc(user.getId());
        } else if (user.hasRole("MERCHANT")) {
            orders = orderRepository.findByMerchantId(user.getId());
        } else {
            orders = orderRepository.findByCustomerIdOrderByCreatedAtDesc(user.getId());
        }

        if (status != null && !status.isBlank()) {
            orders = orders.stream()
                .filter(o -> o.getStatus().getCode().equalsIgnoreCase(status))
                .collect(Collectors.toList());
        }
        if (restaurantId != null) {
            orders = orders.stream()
                .filter(o -> o.getRestaurant().getId().equals(restaurantId))
                .collect(Collectors.toList());
        }

        return orders.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Override
    public OrderResponseDto getOrderById(Long id) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));
        return mapToDto(order);
    }

    @Override
    public OrderResponseDto getOrderTracking(Long id) {
        return getOrderById(id);
    }

    @Override
    @Transactional
    public OrderResponseDto updateOrderStatus(User user, Long id, UpdateOrderStatusRequest req) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        String toStatus = req.getStatusCode() != null ? req.getStatusCode() : req.getStatus();
        if (toStatus == null || toStatus.isBlank()) {
            throw new BadRequestException("statusCode is required");
        }

        OrderStatus newStatus = orderStatusRepository.findByCode(toStatus.toUpperCase())
            .orElseThrow(() -> new BadRequestException("Invalid status: " + toStatus));

        String fromStatusCode = order.getStatus().getCode();
        validateRoleTransition(user, order, fromStatusCode, newStatus.getCode());

        order.setStatus(newStatus);
        order = orderRepository.save(order);

        orderStatusLogRepository.save(OrderStatusLog.builder()
            .orderId(order.getId())
            .previousStatus(fromStatusCode)
            .newStatus(newStatus.getCode())
            .changedBy(user)
            .reason(req.getReason())
            .build());

        return mapToDto(order);
    }

    @Override
    @Transactional
    public OrderResponseDto acceptOrder(User driver, Long id) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!"CONFIRMED".equalsIgnoreCase(order.getStatus().getCode()) && !"PENDING".equalsIgnoreCase(order.getStatus().getCode())) {
            throw new BadRequestException("Order is not available for driver acceptance");
        }

        OrderStatus acceptedStatus = orderStatusRepository.findByCode("DRIVER_ACCEPTED")
            .orElseThrow(() -> new BadRequestException("DRIVER_ACCEPTED status not found"));

        order.setDriver(driver);
        order.setStatus(acceptedStatus);
        order = orderRepository.save(order);

        orderStatusLogRepository.save(OrderStatusLog.builder()
            .orderId(order.getId())
            .previousStatus("CONFIRMED")
            .newStatus("DRIVER_ACCEPTED")
            .changedBy(driver)
            .reason("Driver accepted order")
            .build());

        return mapToDto(order);
    }

    @Override
    @Transactional
    public void rejectDriverOffer(User driver, Long id, RejectOrderRequest req) {
        driverOfferRepository.findByOrderIdAndDriverId(id, driver.getId())
            .ifPresent(offer -> {
                offer.setStatus("REJECTED");
                offer.setResponseReason(req != null ? req.getReason() : null);
                offer.setRespondedAt(LocalDateTime.now());
                driverOfferRepository.save(offer);
            });
    }

    @Override
    @Transactional
    public OrderResponseDto cancelDriverOrder(User driver, Long id, CancelOrderRequest req) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (order.getDriver() == null || !order.getDriver().getId().equals(driver.getId())) {
            throw new ForbiddenException("You are not assigned to this order");
        }

        OrderStatus cancelledStatus = orderStatusRepository.findByCode("CANCELLED")
            .orElseThrow(() -> new BadRequestException("CANCELLED status not found"));

        order.setStatus(cancelledStatus);
        order.setCancelReason(req != null ? req.getReason() : "Driver cancelled");
        order.setCancelledByRole("DRIVER");
        order.setCancelledByUser(driver);
        order.setCancelledAt(LocalDateTime.now());
        order = orderRepository.save(order);

        return mapToDto(order);
    }

    @Override
    @Transactional
    public OrderResponseDto cancelOrder(User customer, Long id, CancelOrderRequest req) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getCustomer().getId().equals(customer.getId()) && !customer.hasRole("ADMIN")) {
            throw new ForbiddenException("Cannot cancel someone else's order");
        }

        if (order.getDriver() != null) {
            throw new BadRequestException("Cannot cancel an order after a driver has accepted it");
        }

        OrderStatus cancelledStatus = orderStatusRepository.findByCode("CANCELLED")
            .orElseThrow(() -> new BadRequestException("CANCELLED status not found"));

        order.setStatus(cancelledStatus);
        order.setCancelReason(req != null ? req.getReason() : "Customer cancelled");
        order.setCancelledByRole("CUSTOMER");
        order.setCancelledByUser(customer);
        order.setCancelledAt(LocalDateTime.now());
        order = orderRepository.save(order);

        return mapToDto(order);
    }

    @Override
    @Transactional
    public OrderResponseDto rejectOrder(User merchant, Long id, RejectOrderRequest req) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));

        if (!order.getRestaurant().getOwner().getId().equals(merchant.getId()) && !merchant.hasRole("ADMIN")) {
            throw new ForbiddenException("You do not own this restaurant");
        }

        OrderStatus cancelledStatus = orderStatusRepository.findByCode("CANCELLED")
            .orElseThrow(() -> new BadRequestException("CANCELLED status not found"));

        order.setStatus(cancelledStatus);
        order.setCancelReason(req != null ? req.getReason() : "Merchant rejected order");
        order.setCancelledByRole("MERCHANT");
        order.setCancelledByUser(merchant);
        order.setCancelledAt(LocalDateTime.now());
        order = orderRepository.save(order);

        return mapToDto(order);
    }

    @Override
    @Transactional
    public void deleteOrder(User admin, Long id) {
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        order.setDeletedAt(LocalDateTime.now());
        orderRepository.save(order);
    }

    private void validateRoleTransition(User user, Order order, String fromStatus, String toStatus) {
        if (fromStatus.equalsIgnoreCase(toStatus)) return;
        if ("COMPLETED".equalsIgnoreCase(fromStatus) || "CANCELLED".equalsIgnoreCase(fromStatus)) {
            throw new ConflictException("Cannot update a terminal " + fromStatus + " order");
        }

        if (user.hasRole("ADMIN")) return;

        if (user.hasRole("DRIVER")) {
            if (!toStatus.equalsIgnoreCase("PICKING_UP") && !toStatus.equalsIgnoreCase("DELIVERING") && !toStatus.equalsIgnoreCase("COMPLETED")) {
                throw new ConflictException("Driver cannot change status from " + fromStatus + " to " + toStatus);
            }
        } else if (user.hasRole("MERCHANT")) {
            if (!toStatus.equalsIgnoreCase("CONFIRMED") && !toStatus.equalsIgnoreCase("CANCELLED")) {
                throw new ConflictException("Merchant cannot change status from " + fromStatus + " to " + toStatus);
            }
        }
    }

    private OrderResponseDto mapToDto(Order o) {
        List<OrderItem> items = orderItemRepository.findByOrderId(o.getId());
        List<OrderItemResponseDto> itemDtos = items.stream().map(item -> {
            List<OrderItemTopping> itemToppings = orderItemToppingRepository.findByOrderItemId(item.getId());
            List<OrderItemToppingResponseDto> toppingDtos = itemToppings.stream().map(t ->
                OrderItemToppingResponseDto.builder()
                    .id(t.getId())
                    .toppingId(t.getTopping().getId())
                    .toppingName(t.getTopping().getName())
                    .quantity(t.getQuantity())
                    .price(t.getPrice())
                    .build()
            ).collect(Collectors.toList());

            return OrderItemResponseDto.builder()
                .id(item.getId())
                .foodId(item.getFood() != null ? item.getFood().getId() : null)
                .foodName(item.getFoodName())
                .quantity(item.getQuantity())
                .priceAtOrder(item.getPriceAtOrder())
                .toppings(toppingDtos)
                .build();
        }).collect(Collectors.toList());

        return OrderResponseDto.builder()
            .id(o.getId())
            .orderCode(o.getOrderCode())
            .idempotencyKey(o.getIdempotencyKey())
            .customerId(o.getCustomer() != null ? o.getCustomer().getId() : null)
            .customerName(o.getCustomer() != null ? o.getCustomer().getFullName() : null)
            .customerPhone(o.getCustomer() != null ? o.getCustomer().getPhone() : null)
            .restaurantId(o.getRestaurant() != null ? o.getRestaurant().getId() : null)
            .restaurantName(o.getRestaurant() != null ? o.getRestaurant().getName() : null)
            .driverId(o.getDriver() != null ? o.getDriver().getId() : null)
            .driverName(o.getDriver() != null ? o.getDriver().getFullName() : null)
            .driverPhone(o.getDriver() != null ? o.getDriver().getPhone() : null)
            .voucherId(o.getVoucher() != null ? o.getVoucher().getId() : null)
            .receiverAddress(o.getReceiverAddress())
            .receiverLat(o.getReceiverLat())
            .receiverLng(o.getReceiverLng())
            .distanceKm(o.getDistanceKm())
            .subtotalAmount(o.getSubtotalAmount())
            .taxAmount(o.getTaxAmount())
            .shippingFee(o.getShippingFee())
            .discountAmount(o.getDiscountAmount())
            .totalAmount(o.getTotalAmount())
            .statusCode(o.getStatus() != null ? o.getStatus().getCode() : null)
            .statusLabel(o.getStatus() != null ? o.getStatus().getLabel() : null)
            .version(o.getVersion())
            .cancelReason(o.getCancelReason())
            .createdAt(o.getCreatedAt())
            .items(itemDtos)
            .build();
    }
}
