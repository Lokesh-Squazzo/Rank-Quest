package com.rankquest.controller;

import com.rankquest.dto.ApiResponse;
import com.rankquest.dto.SubmissionRequest;
import com.rankquest.dto.SubmissionResponse;
import com.rankquest.exception.BadRequestException;
import com.rankquest.service.SubmissionService;
import jakarta.validation.Valid;
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
    public ResponseEntity<ApiResponse<SubmissionResponse>> submitSolution(
            @PathVariable Long problemId,
            Principal principal,
            @RequestParam(required = false) String email,
            @Valid @RequestBody SubmissionRequest request) {

        String effectiveEmail = resolveEmail(principal, email);
        ApiResponse<SubmissionResponse> response = submissionService.submitSolution(problemId, effectiveEmail, request);
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

    @GetMapping("/my-history")
    public ResponseEntity<ApiResponse<List<SubmissionResponse>>> getMySubmissionHistory(
            Principal principal,
            @RequestParam(required = false) String email) {
        String effectiveEmail = resolveEmail(principal, email);
        List<SubmissionResponse> history = submissionService.getUserSubmissions(effectiveEmail);
        return ResponseEntity.ok(ApiResponse.success("Submission history retrieved", history));
    }

    @GetMapping("/problem/{problemId}")
    public ResponseEntity<ApiResponse<List<SubmissionResponse>>> getProblemSubmissions(
            @PathVariable Long problemId,
            Principal principal,
            @RequestParam(required = false) String email) {
        String effectiveEmail = resolveEmail(principal, email);
        List<SubmissionResponse> submissions = submissionService.getProblemSubmissions(problemId, effectiveEmail);
        return ResponseEntity.ok(ApiResponse.success("Problem submissions retrieved", submissions));
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