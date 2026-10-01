package com.rankquest.controller;

import com.rankquest.dto.ApiResponse;
import com.rankquest.dto.UpdateProfileRequest;
import com.rankquest.dto.UserProfileResponse;
import com.rankquest.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile-by-email")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProfileByEmail(@RequestParam String email) {
        UserProfileResponse response = userService.getProfileByEmail(email);
        return ResponseEntity.ok(ApiResponse.success("Profile fetched", Map.of("user", response)));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateUserProfile(
            @RequestBody UpdateProfileRequest request,
            @RequestParam String email) {

        UserProfileResponse response = userService.updateUserProfile(email, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", Map.of("user", response)));
    }
}