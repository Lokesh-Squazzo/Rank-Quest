package com.rankquest.service;

import com.rankquest.dto.ApiResponse;
import com.rankquest.dto.SubmissionRequest;
import com.rankquest.model.Submission;
import java.util.List;

public interface SubmissionService {
    ApiResponse<Submission> submitSolution(Long problemId, String email, SubmissionRequest request);
    List<Long> getSolvedProblemIds(String email);
}
