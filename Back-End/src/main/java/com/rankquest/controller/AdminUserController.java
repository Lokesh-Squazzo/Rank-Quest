package com.rankquest.controller;

import com.rankquest.dto.ApiResponse;
import com.rankquest.dto.UserProfileResponse;
import com.rankquest.exception.BadRequestException;
import com.rankquest.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserProfileResponse>>> getAllUsers() {
        List<UserProfileResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String role = request.get("role");
        if (role == null || role.isBlank()) {
            throw new BadRequestException("Role parameter is required (USER or ADMIN)");
        }
        UserProfileResponse updatedUser = userService.updateUserRole(id, role);
        return ResponseEntity.ok(ApiResponse.success("User role updated successfully", updatedUser));
    }
}
