package com.grabfood.controller;

import com.grabfood.dto.ApiResponse;
import com.grabfood.dto.CommonDto.CreateAddressRequest;
import com.grabfood.entity.UserAddress;
import com.grabfood.security.CustomUserDetails;
import com.grabfood.service.AddressService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
public class AddressController {

    private final AddressService addressService;

    @GetMapping("/suggest")
    public ResponseEntity<ApiResponse<List<Map<String, Object>>>> suggest(@RequestParam(required = false) String query) {
        return ResponseEntity.ok(ApiResponse.success(addressService.suggest(query)));
    }

    @GetMapping("/detail/{placeId}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> detail(@PathVariable String placeId) {
        return ResponseEntity.ok(ApiResponse.success(addressService.detail(placeId)));
    }

    @GetMapping("/reverse")
    public ResponseEntity<ApiResponse<Map<String, Object>>> reverse(
        @RequestParam(required = false) Double lat,
        @RequestParam(required = false) Double lng
    ) {
        return ResponseEntity.ok(ApiResponse.success(addressService.reverse(lat, lng)));
    }

    @GetMapping("/mine")
    public ResponseEntity<ApiResponse<List<UserAddress>>> listMine(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.success(addressService.listMine(userDetails.getUser())));
    }

    @PostMapping("/mine")
    public ResponseEntity<ApiResponse<UserAddress>> createMine(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @Valid @RequestBody CreateAddressRequest req
    ) {
        return ResponseEntity.ok(ApiResponse.success(addressService.createMine(userDetails.getUser(), req)));
    }

    @PutMapping("/mine/{id}")
    public ResponseEntity<ApiResponse<UserAddress>> updateMine(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Integer id,
        @RequestBody CreateAddressRequest req
    ) {
        return ResponseEntity.ok(ApiResponse.success(addressService.updateMine(userDetails.getUser(), id, req)));
    }

    @DeleteMapping("/mine/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMine(
        @AuthenticationPrincipal CustomUserDetails userDetails,
        @PathVariable Integer id
    ) {
        addressService.deleteMine(userDetails.getUser(), id);
        return ResponseEntity.ok(ApiResponse.message("Address deleted"));
    }
}
