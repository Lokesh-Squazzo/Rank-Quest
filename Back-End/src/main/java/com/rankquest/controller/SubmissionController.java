package com.rankquest.controller;

import com.rankquest.dto.ApiResponse;
import com.rankquest.dto.SubmissionRequest;
import com.rankquest.model.Submission;
import com.rankquest.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping("/{problemId}")
    public ResponseEntity<ApiResponse<Submission>> submitSolution(
            @PathVariable Long problemId,
            @RequestParam String email,
            @RequestBody SubmissionRequest request) {

        ApiResponse<Submission> response = submissionService.submitSolution(problemId, email, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-solved")
    public ResponseEntity<List<Long>> getSolvedProblems(@RequestParam String email) {
        List<Long> solvedIds = submissionService.getSolvedProblemIds(email);
        return ResponseEntity.ok(solvedIds);
    }
}