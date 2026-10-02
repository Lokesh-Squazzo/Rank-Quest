package com.rankquest.service.impl;

import com.rankquest.dto.ApiResponse;
import com.rankquest.dto.SubmissionRequest;
import com.rankquest.dto.SubmissionResponse;
import com.rankquest.exception.ResourceNotFoundException;
import com.rankquest.model.Problem;
import com.rankquest.model.Submission;
import com.rankquest.model.User;
import com.rankquest.repository.ProblemRepository;
import com.rankquest.repository.SubmissionRepository;
import com.rankquest.repository.UserRepository;
import com.rankquest.service.SubmissionService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SubmissionServiceImpl implements SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final ProblemRepository problemRepository;

    @Override
    @Transactional
    public ApiResponse<SubmissionResponse> submitSolution(Long problemId, String email, SubmissionRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id: " + problemId));

        boolean alreadySolved = submissionRepository.existsByUserIdAndProblemIdAndStatus(
                user.getId(), problem.getId(), "ACCEPTED"
        );

        Submission submission = Submission.builder()
                .user(user)
                .problem(problem)
                .code(request.getCode())
                .language(request.getLanguage())
                .status(request.getStatus())
                .submittedAt(LocalDateTime.now())
                .build();

        submission = submissionRepository.save(submission);

        if ("ACCEPTED".equalsIgnoreCase(request.getStatus()) && !alreadySolved) {
            user.setTotalScore(user.getTotalScore() + problem.getPoints());
            user.setProblemsSolved(user.getProblemsSolved() + 1);
            userRepository.save(user);
        }

        return ApiResponse.success("Submission recorded", SubmissionResponse.fromEntity(submission));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Long> getSolvedProblemIds(String email) {
        return submissionRepository.findSolvedProblemIdsByEmail(email);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubmissionResponse> getUserSubmissions(String email) {
        return submissionRepository.findByUserEmailOrderBySubmittedAtDesc(email)
                .stream()
                .map(SubmissionResponse::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<SubmissionResponse> getProblemSubmissions(Long problemId, String email) {
        return submissionRepository.findByUserEmailAndProblemIdOrderBySubmittedAtDesc(email, problemId)
                .stream()
                .map(SubmissionResponse::fromEntity)
                .collect(Collectors.toList());
    }
}
