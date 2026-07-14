package com.rankquest.controller;

import com.rankquest.dto.UserProfileResponse;
import com.rankquest.model.User;
import com.rankquest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/rankings")
public class RankingController {

    @Autowired
    private UserRepository userRepository;

    private static final String ADMIN_USERNAME = "admin";

    @GetMapping("/global")
    public ResponseEntity<List<UserProfileResponse>> getGlobalRankings() {
        List<User> topUsers = userRepository.findTop50ByUsernameNotOrderByTotalScoreDesc(ADMIN_USERNAME);

        List<UserProfileResponse> response = topUsers.stream()
                .map(UserProfileResponse::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/college")
    public ResponseEntity<List<UserProfileResponse>> getCollegeRankings(@RequestParam String college) {
        List<User> topUsers = userRepository.findTop50ByCollegeAndUsernameNotOrderByTotalScoreDesc(college, ADMIN_USERNAME);

        List<UserProfileResponse> response = topUsers.stream()
                .map(UserProfileResponse::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}