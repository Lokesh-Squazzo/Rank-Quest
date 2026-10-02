package com.rankquest.controller;

import com.rankquest.dto.ApiResponse;
import com.rankquest.dto.UpdateProfileRequest;
import com.rankquest.dto.UserProfileResponse;
import com.rankquest.exception.BadRequestException;
import com.rankquest.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCurrentUserProfile(
            Principal principal,
            @RequestParam(required = false) String email) {
        String effectiveEmail = resolveEmail(principal, email);
        UserProfileResponse response = userService.getProfileByEmail(effectiveEmail);
        return ResponseEntity.ok(ApiResponse.success("Profile fetched", Map.of("user", response)));
    }

    @GetMapping("/profile-by-email")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProfileByEmail(
            Principal principal,
            @RequestParam(required = false) String email) {
        String effectiveEmail = resolveEmail(principal, email);
        UserProfileResponse response = userService.getProfileByEmail(effectiveEmail);
        return ResponseEntity.ok(ApiResponse.success("Profile fetched", Map.of("user", response)));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateUserProfile(
            @RequestBody UpdateProfileRequest request,
            Principal principal,
            @RequestParam(required = false) String email) {
        String effectiveEmail = resolveEmail(principal, email);
        UserProfileResponse response = userService.updateUserProfile(effectiveEmail, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", Map.of("user", response)));
    }

    private String resolveEmail(Principal principal, String emailParam) {
        if (principal != null && StringUtils.hasText(principal.getName())) {
            return principal.getName();
        }
        if (StringUtils.hasText(emailParam)) {
            return emailParam;
        }
        throw new BadRequestException("User email could not be determined. Please authenticate or provide email.");
    }
}