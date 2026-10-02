package com.rankquest.dto;

import com.rankquest.model.Submission;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionResponse {
    private Long id;
    private Long problemId;
    private String problemTitle;
    private String language;
    private String status;
    private String code;
    private LocalDateTime submittedAt;
    private int points;

    public static SubmissionResponse fromEntity(Submission submission) {
        return SubmissionResponse.builder()
                .id(submission.getId())
                .problemId(submission.getProblem() != null ? submission.getProblem().getId() : null)
                .problemTitle(submission.getProblem() != null ? submission.getProblem().getTitle() : null)
                .language(submission.getLanguage())
                .status(submission.getStatus())
                .code(submission.getCode())
                .submittedAt(submission.getSubmittedAt())
                .points(submission.getProblem() != null ? submission.getProblem().getPoints() : 0)
                .build();
    }
}
