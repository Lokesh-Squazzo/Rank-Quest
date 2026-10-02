package com.rankquest.service;

import com.rankquest.dto.ProblemRequest;
import com.rankquest.model.Problem;
import java.util.List;

public interface ProblemService {
    List<Problem> getAllProblems();
    Problem getProblemById(Long id);
    Problem createProblem(ProblemRequest request);
    Problem updateProblem(Long id, ProblemRequest request);
    void deleteProblem(Long id);
}
