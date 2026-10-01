package com.rankquest.service;

import com.rankquest.dto.ApiResponse;
import com.rankquest.dto.AuthResponseData;
import com.rankquest.dto.LoginRequest;
import com.rankquest.dto.SignUpRequest;

public interface AuthService {
    ApiResponse<Void> registerUser(SignUpRequest signUpRequest);
    ApiResponse<AuthResponseData> authenticateUser(LoginRequest loginRequest);
}
