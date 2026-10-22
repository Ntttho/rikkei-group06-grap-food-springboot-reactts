package com.grabfood.service.impl;

import com.grabfood.dto.ChatDto.ChatMessageResponse;
import com.grabfood.dto.ChatDto.SendMessageRequest;
import com.grabfood.entity.ChatMessage;
import com.grabfood.entity.Restaurant;
import com.grabfood.entity.User;
import com.grabfood.exception.ResourceNotFoundException;
import com.grabfood.repository.ChatMessageRepository;
import com.grabfood.repository.RestaurantRepository;
import com.grabfood.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatServiceImpl implements ChatService {

    private final ChatMessageRepository chatMessageRepository;
    private final RestaurantRepository restaurantRepository;

    @Override
    @Transactional
    public ChatMessageResponse sendMessage(User currentUser, SendMessageRequest req) {
        Restaurant shop = restaurantRepository.findById(req.getShopId())
            .orElseThrow(() -> new ResourceNotFoundException("Restaurant not found with id: " + req.getShopId()));

        boolean isMerchant = shop.getOwner() != null && shop.getOwner().getId().equals(currentUser.getId());
        String senderRole = isMerchant ? "MERCHANT" : "CUSTOMER";

        ChatMessage msg = ChatMessage.builder()
            .sender(currentUser)
            .shop(shop)
            .orderId(req.getOrderId())
            .message(req.getMessage())
            .senderRole(senderRole)
            .isRead(false)
            .build();

        ChatMessage saved = chatMessageRepository.save(msg);
        return toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getMessagesByShop(User currentUser, Integer shopId, Integer orderId) {
        List<ChatMessage> list;
        if (orderId != null) {
            list = chatMessageRepository.findByOrderIdOrderByCreatedAtAsc(orderId);
        } else {
            list = chatMessageRepository.findByShopIdOrderByCreatedAtAsc(shopId);
        }

        return list.stream().map(this::toDto).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatMessageResponse> getMessagesByOrder(User currentUser, Integer orderId) {
        return chatMessageRepository.findByOrderIdOrderByCreatedAtAsc(orderId).stream()
            .map(this::toDto)
            .collect(Collectors.toList());
    }

    private ChatMessageResponse toDto(ChatMessage m) {
        String name = "Khách hàng";
        if (m.getSender() != null) {
            name = m.getSender().getFullName() != null ? m.getSender().getFullName() : m.getSender().getPhone();
        }

        return ChatMessageResponse.builder()
            .id(m.getId())
            .senderId(m.getSender() != null ? m.getSender().getId() : null)
            .senderName(name)
            .shopId(m.getShop() != null ? m.getShop().getId() : null)
            .shopName(m.getShop() != null ? m.getShop().getName() : "")
            .orderId(m.getOrderId())
            .message(m.getMessage())
            .senderRole(m.getSenderRole())
            .isRead(m.getIsRead())
            .createdAt(m.getCreatedAt())
            .build();
    }
}
