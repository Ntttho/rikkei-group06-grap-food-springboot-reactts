package com.grabfood.controller;

import com.grabfood.dto.ApiResponse;
import com.grabfood.dto.ChatDto.ChatMessageResponse;
import com.grabfood.dto.ChatDto.SendMessageRequest;
import com.grabfood.security.CustomUserDetails;
import com.grabfood.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    @PostMapping("/messages")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ChatMessageResponse>> sendMessage(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @Valid @RequestBody SendMessageRequest req
    ) {
        ChatMessageResponse response = chatService.sendMessage(userDetails.getUser(), req);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Message sent", response));
    }

    @GetMapping("/restaurants/{shopId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<ChatMessageResponse>>> getMessagesByShop(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Integer shopId,
        @RequestParam(required = false) Integer orderId
    ) {
        List<ChatMessageResponse> messages = chatService.getMessagesByShop(userDetails.getUser(), shopId, orderId);
        return ResponseEntity.ok(ApiResponse.success(messages));
    }

    @GetMapping("/orders/{orderId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<ChatMessageResponse>>> getMessagesByOrder(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Integer orderId
    ) {
        List<ChatMessageResponse> messages = chatService.getMessagesByOrder(userDetails.getUser(), orderId);
        return ResponseEntity.ok(ApiResponse.success(messages));
    }
}
