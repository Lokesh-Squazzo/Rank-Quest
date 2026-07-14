package com.rankquest.dto;

import lombok.Data;

@Data
public class SubmissionRequest {
    private String code;
    private String language;
    private String status; // "ACCEPTED" or "WRONG_ANSWER" (Sent by frontend after Judge0 check)

    // Getters and Setters
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}