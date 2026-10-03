package com.rankquest.service;

import com.rankquest.dto.UpdateProfileRequest;
import com.rankquest.dto.UserProfileResponse;

import java.util.List;

public interface UserService {
    UserProfileResponse getProfileByEmail(String email);
    UserProfileResponse updateUserProfile(String email, UpdateProfileRequest request);
    List<UserProfileResponse> getAllUsers();
    UserProfileResponse updateUserRole(Long userId, String role);
}
