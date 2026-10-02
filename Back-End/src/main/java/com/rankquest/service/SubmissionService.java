package com.rankquest.service;

import com.rankquest.dto.ApiResponse;
import com.rankquest.dto.SubmissionRequest;
import com.rankquest.dto.SubmissionResponse;

import java.util.List;

public interface SubmissionService {
    ApiResponse<SubmissionResponse> submitSolution(Long problemId, String email, SubmissionRequest request);
    List<Long> getSolvedProblemIds(String email);
    List<SubmissionResponse> getUserSubmissions(String email);
    List<SubmissionResponse> getProblemSubmissions(Long problemId, String email);
}
