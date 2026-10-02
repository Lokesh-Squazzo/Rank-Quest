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
import com.rankquest.security.jwt.JwtUtils;
import com.rankquest.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;

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
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String jwt = jwtUtils.generateJwtToken(authentication);

            com.rankquest.security.UserDetailsImpl userDetails =
                    (com.rankquest.security.UserDetailsImpl) authentication.getPrincipal();
            User user = userDetails.getUser();

            AuthResponseData responseData = AuthResponseData.builder()
                    .token(jwt)
                    .user(new UserProfileResponse(user))
                    .build();

            return ApiResponse.success("Login successful", responseData);
        } catch (BadCredentialsException ex) {
            throw new BadRequestException("Error: Invalid email or password");
        }
    }
}
