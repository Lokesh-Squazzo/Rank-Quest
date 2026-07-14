package com.rankquest.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@Table(name = "problems")
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String difficulty;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public String getAcceptance() {
        return acceptance;
    }

    public void setAcceptance(String acceptance) {
        this.acceptance = acceptance;
    }

    public int getPoints() {
        return points;
    }

    public void setPoints(int points) {
        this.points = points;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTestCases() {
        return testCases;
    }

    public void setTestCases(String testCases) {
        this.testCases = testCases;
    }

    private String acceptance;

    // Points awarded for solving this problem
    private int points;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String description;

    // Store test cases as a JSON string
    // Example: [{"input": "1 2", "output": "3"}]
    @Lob
    @Column(columnDefinition = "TEXT")
    private String testCases;

    // Updated constructor to include ALL fields
    public Problem(String title, String description, String difficulty, String acceptance, int points, String testCases) {
        this.title = title;
        this.description = description;
        this.difficulty = difficulty;
        this.acceptance = acceptance;
        this.points = points;
        this.testCases = testCases;
    }
}