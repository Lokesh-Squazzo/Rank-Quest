package com.rankquest.controller;

import com.rankquest.dto.LoginRequest;
import com.rankquest.dto.LoginResponse;
import com.rankquest.dto.SignUpRequest;
import com.rankquest.model.Role;
import com.rankquest.model.User;
import com.rankquest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignUpRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new LoginResponse(false, "Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new LoginResponse(false, "Error: Email is already in use!"));
        }

        // Create new user's account
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));

        user.setRollNumber(signUpRequest.getRollNumber());
        user.setCollege(signUpRequest.getCollege());
        user.setBranch(signUpRequest.getBranch());
        user.setYear(signUpRequest.getYear());

        user.setRole(Role.USER);

        userRepository.save(user);

        return ResponseEntity.ok(new LoginResponse(true, "User registered successfully!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        // 1. Find the user by email
        Optional<User> userOptional = userRepository.findByEmail(loginRequest.getEmail());

        // 2. Check if user exists and password matches
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {

                // 3. Send back the user data so React can display it immediately
                Map<String, Object> data = new HashMap<>();
                data.put("user", user);
                data.put("token", "dummy-jwt-token-" + user.getId());

                return ResponseEntity.ok(new LoginResponse(true, "Login successful", data));
            }
        }

        return ResponseEntity.status(401).body(new LoginResponse(false, "Error: Invalid email or password"));
    }
}