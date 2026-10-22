package com.grabfood.repository;

import com.grabfood.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, Integer> {

    List<ChatMessage> findByShopIdAndSenderIdOrderByCreatedAtAsc(Integer shopId, Integer senderId);

    List<ChatMessage> findByOrderIdOrderByCreatedAtAsc(Integer orderId);

    @Query("SELECT m FROM ChatMessage m WHERE m.shop.id = :shopId AND (m.sender.id = :userId OR (m.sender.id = m.shop.owner.id AND m.orderId = :orderId)) ORDER BY m.createdAt ASC")
    List<ChatMessage> findConversation(
        @Param("shopId") Integer shopId,
        @Param("userId") Integer userId,
        @Param("orderId") Integer orderId
    );

    @Query("SELECT m FROM ChatMessage m WHERE m.shop.id = :shopId ORDER BY m.createdAt ASC")
    List<ChatMessage> findByShopIdOrderByCreatedAtAsc(@Param("shopId") Integer shopId);
}
