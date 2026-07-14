package com.rankquest.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@Table(name = "submissions")
public class Submission {

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Problem getProblem() {
        return problem;
    }

    public void setProblem(Problem problem) {
        this.problem = problem;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Link to the User who submitted
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Link to the Problem being solved
    @ManyToOne
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String code;       // The actual code they wrote

    private String language;   // e.g., "python", "java"

    private String status;     // "ACCEPTED", "WRONG_ANSWER"

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