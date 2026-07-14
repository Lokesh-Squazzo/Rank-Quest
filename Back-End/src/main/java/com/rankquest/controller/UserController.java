package com.rankquest.controller;

import com.rankquest.dto.LoginResponse;
import com.rankquest.dto.UpdateProfileRequest;
import com.rankquest.dto.UserProfileResponse;
import com.rankquest.model.User;
import com.rankquest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile-by-email")
    public ResponseEntity<?> getProfileByEmail(@RequestParam String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOptional.get();
        UserProfileResponse response = new UserProfileResponse(user);

        // FIX: Wrap the response in a "user" map to match AuthController behavior
        Map<String, Object> data = new HashMap<>();
        data.put("user", response);

        return ResponseEntity.ok(new LoginResponse(true, "Profile fetched", data));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(@RequestBody UpdateProfileRequest request, @RequestParam String email) {
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOptional.get();

        // Update fields
        if (request.getName() != null) user.setUsername(request.getName());
        if (request.getRollNumber() != null) user.setRollNumber(request.getRollNumber());
        if (request.getCollege() != null) user.setCollege(request.getCollege());
        if (request.getBranch() != null) user.setBranch(request.getBranch());
        if (request.getYear() != null) user.setYear(request.getYear());
        if (request.getLocation() != null) user.setLocation(request.getLocation());
        if (request.getBio() != null) user.setBio(request.getBio());

        userRepository.save(user);

        UserProfileResponse response = new UserProfileResponse(user);

        // FIX: Wrap the response in a "user" map so AuthContext can read response.data.user
        Map<String, Object> data = new HashMap<>();
        data.put("user", response);

        return ResponseEntity.ok(new LoginResponse(true, "Profile updated successfully", data));
    }
}