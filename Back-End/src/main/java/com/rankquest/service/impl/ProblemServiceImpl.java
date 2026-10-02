package com.rankquest.service.impl;

import com.rankquest.dto.ProblemRequest;
import com.rankquest.exception.ResourceNotFoundException;
import com.rankquest.model.Problem;
import com.rankquest.repository.ProblemRepository;
import com.rankquest.service.ProblemService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProblemServiceImpl implements ProblemService {

    private final ProblemRepository problemRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Problem> getAllProblems() {
        return problemRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Problem getProblemById(Long id) {
        return problemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id: " + id));
    }

    @Override
    @Transactional
    public Problem createProblem(ProblemRequest request) {
        Problem problem = Problem.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .difficulty(request.getDifficulty())
                .acceptance(request.getAcceptance() != null ? request.getAcceptance() : "0.0%")
                .points(request.getPoints())
                .testCases(request.getTestCases() != null ? request.getTestCases() : "[]")
                .build();

        return problemRepository.save(problem);
    }

    @Override
    @Transactional
    public Problem updateProblem(Long id, ProblemRequest request) {
        Problem problem = problemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with id: " + id));

        problem.setTitle(request.getTitle());
        problem.setDescription(request.getDescription());
        problem.setDifficulty(request.getDifficulty());
        if (request.getAcceptance() != null) {
            problem.setAcceptance(request.getAcceptance());
        }
        problem.setPoints(request.getPoints());
        if (request.getTestCases() != null) {
            problem.setTestCases(request.getTestCases());
        }

        return problemRepository.save(problem);
    }
}
