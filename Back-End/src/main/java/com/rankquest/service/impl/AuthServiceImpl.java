package com.rankquest.service.impl;

import com.rankquest.dto.ApiResponse;
import com.rankquest.dto.AuthResponseData;
import com.rankquest.dto.LoginRequest;
import com.rankquest.dto.SignUpRequest;
import com.rankquest.dto.UserProfileResponse;
import com.rankquest.exception.BadRequestException;
import com.rankquest.model.Role;
import com.rankquest.model.User;
import com.rankquest.repository.UserRepository;
import com.rankquest.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public ApiResponse<Void> registerUser(SignUpRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new BadRequestException("Error: Username is already taken!");
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            throw new BadRequestException("Error: Email is already in use!");
        }

        User user = User.builder()
                .username(signUpRequest.getUsername())
                .email(signUpRequest.getEmail())
                .password(passwordEncoder.encode(signUpRequest.getPassword()))
                .rollNumber(signUpRequest.getRollNumber())
                .college(signUpRequest.getCollege())
                .branch(signUpRequest.getBranch())
                .year(signUpRequest.getYear())
                .role(Role.USER)
                .build();

        userRepository.save(user);
        return ApiResponse.success("User registered successfully!");
    }

    @Override
    @Transactional(readOnly = true)
    public ApiResponse<AuthResponseData> authenticateUser(LoginRequest loginRequest) {
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new BadRequestException("Error: Invalid email or password"));

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            throw new BadRequestException("Error: Invalid email or password");
        }

        AuthResponseData responseData = AuthResponseData.builder()
                .token("dummy-jwt-token-" + user.getId())
                .user(new UserProfileResponse(user))
                .build();

        return ApiResponse.success("Login successful", responseData);
    }
}
