package com.grabfood;

import com.grabfood.dto.OrderDto.CreateOrderRequest;
import com.grabfood.dto.OrderDto.OrderItemRequest;
import com.grabfood.entity.*;
import com.grabfood.exception.ConflictException;
import com.grabfood.repository.*;
import com.grabfood.service.impl.OrderServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock private OrderRepository orderRepository;
    @Mock private OrderItemRepository orderItemRepository;
    @Mock private OrderItemToppingRepository orderItemToppingRepository;
    @Mock private OrderStatusRepository orderStatusRepository;
    @Mock private OrderStatusLogRepository orderStatusLogRepository;
    @Mock private RestaurantRepository restaurantRepository;
    @Mock private FoodItemRepository foodItemRepository;
    @Mock private ToppingRepository toppingRepository;
    @Mock private VoucherRepository voucherRepository;
    @Mock private PaymentRepository paymentRepository;
    @Mock private DriverOfferRepository driverOfferRepository;

    @InjectMocks
    private OrderServiceImpl orderService;

    private User customer;
    private Restaurant restaurant;
    private FoodItem food;
    private OrderStatus pendingStatus;

    @BeforeEach
    void setUp() {
        Role customerRole = Role.builder().id(1).name("CUSTOMER").build();
        customer = User.builder()
            .id(1)
            .phone("0901234567")
            .fullName("Customer Test")
            .roles(new HashSet<>(Collections.singletonList(customerRole)))
            .build();

        restaurant = Restaurant.builder()
            .id(1)
            .name("Com Tam Cali")
            .isOpen(true)
            .approvalStatus("APPROVED")
            .build();

        Category category = Category.builder().id(1).restaurant(restaurant).name("Com").build();

        food = FoodItem.builder()
            .id(1)
            .category(category)
            .name("Com Suon Nuong")
            .price(new BigDecimal("45000"))
            .isAvailable(true)
            .currentQuantity(10)
            .defaultQuantity(10)
            .build();

        pendingStatus = OrderStatus.builder().id(1).code("PENDING").label("Chờ xác nhận").build();
    }

    @Test
    @DisplayName("Should create order successfully and deduct stock")
    void createOrder_Success() {
        CreateOrderRequest req = CreateOrderRequest.builder()
            .restaurantId(1)
            .receiverAddress("123 Le Loi")
            .receiverLat(10.7769)
            .receiverLng(106.7009)
            .distanceKm(2.0)
            .items(Collections.singletonList(
                OrderItemRequest.builder().foodId(1).quantity(2).build()
            ))
            .build();

        when(restaurantRepository.findByIdAndDeletedAtIsNull(1)).thenReturn(Optional.of(restaurant));
        when(orderStatusRepository.findByCode("PENDING")).thenReturn(Optional.of(pendingStatus));
        when(foodItemRepository.findByIdAndDeletedAtIsNull(1)).thenReturn(Optional.of(food));

        Order savedMock = Order.builder()
            .id(100L)
            .orderCode("ORD-12345")
            .customer(customer)
            .restaurant(restaurant)
            .status(pendingStatus)
            .subtotalAmount(new BigDecimal("90000"))
            .shippingFee(new BigDecimal("20000"))
            .totalAmount(new BigDecimal("110000"))
            .version(0)
            .build();

        when(orderRepository.save(any(Order.class))).thenReturn(savedMock);
        when(orderItemRepository.save(any())).thenReturn(OrderItem.builder().id(1L).food(food).foodName(food.getName()).quantity(2).priceAtOrder(food.getPrice()).build());

        var result = orderService.createOrder(customer, req);

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(100L);
        // Verify stock was reduced from 10 to 8
        assertThat(food.getCurrentQuantity()).isEqualTo(8);
        verify(foodItemRepository, times(1)).save(food);
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    @DisplayName("Should throw ConflictException when food stock is insufficient")
    void createOrder_InsufficientStock() {
        CreateOrderRequest req = CreateOrderRequest.builder()
            .restaurantId(1)
            .receiverAddress("123 Le Loi")
            .receiverLat(10.7769)
            .receiverLng(106.7009)
            .distanceKm(2.0)
            .items(Collections.singletonList(
                OrderItemRequest.builder().foodId(1).quantity(20).build() // Stock is only 10
            ))
            .build();

        when(restaurantRepository.findByIdAndDeletedAtIsNull(1)).thenReturn(Optional.of(restaurant));
        when(orderStatusRepository.findByCode("PENDING")).thenReturn(Optional.of(pendingStatus));
        when(foodItemRepository.findByIdAndDeletedAtIsNull(1)).thenReturn(Optional.of(food));

        assertThrows(ConflictException.class, () -> orderService.createOrder(customer, req));
        verify(orderRepository, never()).save(any());
    }
}
