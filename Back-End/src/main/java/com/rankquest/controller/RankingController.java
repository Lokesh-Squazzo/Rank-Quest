package com.rankquest.controller;

import com.rankquest.dto.UserProfileResponse;
import com.rankquest.service.RankingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rankings")
@RequiredArgsConstructor
public class RankingController {

    private final RankingService rankingService;

    @GetMapping("/global")
    public ResponseEntity<List<UserProfileResponse>> getGlobalRankings() {
        return ResponseEntity.ok(rankingService.getGlobalRankings());
    }

    @GetMapping("/college")
    public ResponseEntity<List<UserProfileResponse>> getCollegeRankings(@RequestParam String college) {
        return ResponseEntity.ok(rankingService.getCollegeRankings(college));
    }
}