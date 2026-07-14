package com.rankquest.controller;

import com.rankquest.model.Problem;
import com.rankquest.repository.ProblemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
public class ProblemController {

    @Autowired
    private ProblemRepository problemRepository;

    // Endpoint to get all problems (for the problem list page)
    @GetMapping
    public List<Problem> getAllProblems() {
        return problemRepository.findAll();
    }

    // Endpoint to get a single problem by ID (for the problem description page)
    @GetMapping("/{id}")
    public ResponseEntity<Problem> getProblemById(@PathVariable Long id) {
        return problemRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}