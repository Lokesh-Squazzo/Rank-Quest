package com.rankquest.controller;

import com.rankquest.dto.ApiResponse;
import com.rankquest.dto.AuthResponseData;
import com.rankquest.dto.LoginRequest;
import com.rankquest.dto.SignUpRequest;
import com.rankquest.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<ApiResponse<Void>> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        ApiResponse<Void> response = authService.registerUser(signUpRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponseData>> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        ApiResponse<AuthResponseData> response = authService.authenticateUser(loginRequest);
        return ResponseEntity.ok(response);
    }
}