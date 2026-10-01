package com.rankquest.service;

import com.rankquest.dto.UpdateProfileRequest;
import com.rankquest.dto.UserProfileResponse;

public interface UserService {
    UserProfileResponse getProfileByEmail(String email);
    UserProfileResponse updateUserProfile(String email, UpdateProfileRequest request);
}
