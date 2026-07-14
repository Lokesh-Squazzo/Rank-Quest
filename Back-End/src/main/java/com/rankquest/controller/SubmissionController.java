package com.rankquest.controller;

import com.rankquest.dto.LoginResponse;
import com.rankquest.dto.SubmissionRequest;
import com.rankquest.model.Problem;
import com.rankquest.model.Submission;
import com.rankquest.model.User;
import com.rankquest.repository.ProblemRepository;
import com.rankquest.repository.SubmissionRepository;
import com.rankquest.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    @Autowired
    private SubmissionRepository submissionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProblemRepository problemRepository;

    @PostMapping("/{problemId}")
    public ResponseEntity<?> submitSolution(
            @PathVariable Long problemId,
            @RequestParam String email,
            @RequestBody SubmissionRequest request) {

        // 1. Find User and Problem
        Optional<User> userOpt = userRepository.findByEmail(email);
        Optional<Problem> problemOpt = problemRepository.findById(problemId);

        if (userOpt.isEmpty() || problemOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new LoginResponse(false, "User or Problem not found"));
        }

        User user = userOpt.get();
        Problem problem = problemOpt.get();

        // 2. CRITICAL FIX: Check if solved BEFORE saving the new attempt
        boolean alreadySolved = submissionRepository.existsByUserIdAndProblemIdAndStatus(
                user.getId(), problem.getId(), "ACCEPTED"
        );

        // 3. Create and Save Submission Record
        Submission submission = new Submission(
                user,
                problem,
                request.getCode(),
                request.getLanguage(),
                request.getStatus()
        );
        submissionRepository.save(submission);

        // 4. RANKING LOGIC: Update Score ONLY if it's a NEW correct solution
        if ("ACCEPTED".equalsIgnoreCase(request.getStatus()) && !alreadySolved) {
            // Add Points
            int newScore = user.getTotalScore() + problem.getPoints();
            user.setTotalScore(newScore);

            // Increment Problems Solved Count
            user.setProblemsSolved(user.getProblemsSolved() + 1);

            userRepository.save(user);
        }

        return ResponseEntity.ok(new LoginResponse(true, "Submission recorded", submission));
    }

    @GetMapping("/my-solved")
    public ResponseEntity<?> getSolvedProblems(@RequestParam String email) {
        Optional<User> userOpt = userRepository.findByEmail(email);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        List<Long> solvedIds = submissionRepository.findSolvedProblemIds(userOpt.get().getId());
        return ResponseEntity.ok(solvedIds);
    }
}