package com.rankquest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionRequest {
    private String code;
    private String language;
    private String status; // "ACCEPTED" or "WRONG_ANSWER"
}