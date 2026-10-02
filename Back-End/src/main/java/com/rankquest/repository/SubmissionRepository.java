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

    List<Submission> findByUserIdOrderBySubmittedAtDesc(Long userId);

    List<Submission> findByUserIdAndProblemIdOrderBySubmittedAtDesc(Long userId, Long problemId);

    boolean existsByUserIdAndProblemIdAndStatus(Long userId, Long problemId, String status);

    // --- Direct email queries to avoid separate user lookup roundtrip ---
    @Query("SELECT DISTINCT s.problem.id FROM Submission s WHERE s.user.email = :email AND s.status = 'ACCEPTED'")
    List<Long> findSolvedProblemIdsByEmail(@Param("email") String email);

    @Query("SELECT s FROM Submission s WHERE s.user.email = :email ORDER BY s.submittedAt DESC")
    List<Submission> findByUserEmailOrderBySubmittedAtDesc(@Param("email") String email);

    @Query("SELECT s FROM Submission s WHERE s.user.email = :email AND s.problem.id = :problemId ORDER BY s.submittedAt DESC")
    List<Submission> findByUserEmailAndProblemIdOrderBySubmittedAtDesc(@Param("email") String email, @Param("problemId") Long problemId);

    // --- Legacy ID-based queries ---
    @Query("SELECT DISTINCT s.problem.id FROM Submission s WHERE s.user.id = :userId AND s.status = 'ACCEPTED'")
    List<Long> findSolvedProblemIds(@Param("userId") Long userId);

    void deleteByProblemId(Long problemId);
}