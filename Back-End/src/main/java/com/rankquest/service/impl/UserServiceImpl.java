package com.rankquest.service.impl;

import com.rankquest.dto.UpdateProfileRequest;
import com.rankquest.dto.UserProfileResponse;
import com.rankquest.exception.ResourceNotFoundException;
import com.rankquest.model.User;
import com.rankquest.repository.UserRepository;
import com.rankquest.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getProfileByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return new UserProfileResponse(user);
    }

    @Override
    @Transactional
    public UserProfileResponse updateUserProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        if (request.getName() != null && !request.getName().isBlank()) {
            user.setUsername(request.getName());
        }
        if (request.getRollNumber() != null) {
            user.setRollNumber(request.getRollNumber());
        }
        if (request.getCollege() != null) {
            user.setCollege(request.getCollege());
        }
        if (request.getBranch() != null) {
            user.setBranch(request.getBranch());
        }
        if (request.getYear() != null) {
            user.setYear(request.getYear());
        }
        if (request.getLocation() != null) {
            user.setLocation(request.getLocation());
        }
        if (request.getBio() != null) {
            user.setBio(request.getBio());
        }

        user = userRepository.save(user);
        return new UserProfileResponse(user);
    }

    @Override
    @Transactional(readOnly = true)
    public java.util.List<UserProfileResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserProfileResponse::new)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    @Transactional
    public UserProfileResponse updateUserRole(Long userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        try {
            com.rankquest.model.Role role = com.rankquest.model.Role.valueOf(roleName.toUpperCase());
            user.setRole(role);
        } catch (IllegalArgumentException e) {
            throw new com.rankquest.exception.BadRequestException("Invalid role: " + roleName + ". Allowed roles: USER, ADMIN");
        }

        user = userRepository.save(user);
        return new UserProfileResponse(user);
    }
}
