package com.rankquest.service;

import com.rankquest.model.Problem;
import java.util.List;

public interface ProblemService {
    List<Problem> getAllProblems();
    Problem getProblemById(Long id);
}
