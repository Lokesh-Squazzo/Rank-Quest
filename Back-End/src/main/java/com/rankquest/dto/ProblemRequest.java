package com.rankquest.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProblemRequest {

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Difficulty is required")
    private String difficulty; // "Easy", "Medium", "Hard"

    private String acceptance;

    @Min(value = 1, message = "Points must be at least 1")
    private int points;

    private String testCases;
}
