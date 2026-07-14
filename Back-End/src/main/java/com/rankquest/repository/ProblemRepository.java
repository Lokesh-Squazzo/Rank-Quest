package com.rankquest.repository;

import com.rankquest.model.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {
    // This allows us to check if a problem exists without fetching the whole thing
    boolean existsByTitle(String title);
}