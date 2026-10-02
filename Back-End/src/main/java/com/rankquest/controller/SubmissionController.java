package com.rankquest.controller;

import com.rankquest.dto.ApiResponse;
import com.rankquest.dto.SubmissionRequest;
import com.rankquest.exception.BadRequestException;
import com.rankquest.model.Submission;
import com.rankquest.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final SubmissionService submissionService;

    @PostMapping("/{problemId}")
    public ResponseEntity<ApiResponse<Submission>> submitSolution(
            @PathVariable Long problemId,
            Principal principal,
            @RequestParam(required = false) String email,
            @RequestBody SubmissionRequest request) {

        String effectiveEmail = resolveEmail(principal, email);
        ApiResponse<Submission> response = submissionService.submitSolution(problemId, effectiveEmail, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-solved")
    public ResponseEntity<List<Long>> getSolvedProblems(
            Principal principal,
            @RequestParam(required = false) String email) {
        String effectiveEmail = resolveEmail(principal, email);
        List<Long> solvedIds = submissionService.getSolvedProblemIds(effectiveEmail);
        return ResponseEntity.ok(solvedIds);
    }

    private String resolveEmail(Principal principal, String emailParam) {
        if (principal != null && StringUtils.hasText(principal.getName())) {
            return principal.getName();
        }
        if (StringUtils.hasText(emailParam)) {
            return emailParam;
        }
        throw new BadRequestException("User email could not be determined. Please authenticate or provide email.");
    }
}