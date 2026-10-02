package com.rankquest.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "submissions")
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @Column(columnDefinition = "TEXT")
    private String code;

    private String language;

    private String status;

    @Builder.Default
    private LocalDateTime submittedAt = LocalDateTime.now();

    public Submission(User user, Problem problem, String code, String language, String status) {
        this.user = user;
        this.problem = problem;
        this.code = code;
        this.language = language;
        this.status = status;
        this.submittedAt = LocalDateTime.now();
    }
}