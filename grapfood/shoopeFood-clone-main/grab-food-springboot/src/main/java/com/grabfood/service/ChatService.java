package com.grabfood.service;

import com.grabfood.dto.ChatDto.ChatMessageResponse;
import com.grabfood.dto.ChatDto.SendMessageRequest;
import com.grabfood.entity.User;

import java.util.List;

public interface ChatService {
    ChatMessageResponse sendMessage(User currentUser, SendMessageRequest req);

    List<ChatMessageResponse> getMessagesByShop(User currentUser, Integer shopId, Integer orderId);

    List<ChatMessageResponse> getMessagesByOrder(User currentUser, Integer orderId);
}
