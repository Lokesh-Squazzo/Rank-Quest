package com.rankquest.repository;

import com.rankquest.model.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByUserId(Long userId);

    boolean existsByUserIdAndProblemIdAndStatus(Long userId, Long problemId, String status);

    // --- NEW QUERY ---
    @Query("SELECT DISTINCT s.problem.id FROM Submission s WHERE s.user.id = :userId AND s.status = 'ACCEPTED'")
    List<Long> findSolvedProblemIds(@Param("userId") Long userId);
}