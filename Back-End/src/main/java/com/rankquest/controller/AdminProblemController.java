package com.rankquest.controller;

import com.rankquest.dto.ApiResponse;
import com.rankquest.dto.ProblemRequest;
import com.rankquest.model.Problem;
import com.rankquest.service.ProblemService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/problems")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminProblemController {

    private final ProblemService problemService;

    @PostMapping
    public ResponseEntity<ApiResponse<Problem>> createProblem(@Valid @RequestBody ProblemRequest request) {
        Problem createdProblem = problemService.createProblem(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Problem created successfully", createdProblem));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Problem>> updateProblem(
            @PathVariable Long id,
            @Valid @RequestBody ProblemRequest request) {
        Problem updatedProblem = problemService.updateProblem(id, request);
        return ResponseEntity.ok(ApiResponse.success("Problem updated successfully", updatedProblem));
    }
}
