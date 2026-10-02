package com.rankquest.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionRequest {

    @NotBlank(message = "Submitted code cannot be empty")
    private String code;

    @NotBlank(message = "Programming language cannot be empty")
    private String language;

    @NotBlank(message = "Submission status cannot be empty")
    private String status; // "ACCEPTED" or "WRONG_ANSWER"
}