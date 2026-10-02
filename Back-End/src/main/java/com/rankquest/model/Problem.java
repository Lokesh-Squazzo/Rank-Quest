package com.rankquest.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "problems")
public class Problem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String difficulty;
    private String acceptance;
    private int points;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String testCases;

    public Problem(String title, String description, String difficulty, String acceptance, int points, String testCases) {
        this.title = title;
        this.description = description;
        this.difficulty = difficulty;
        this.acceptance = acceptance;
        this.points = points;
        this.testCases = testCases;
    }
}