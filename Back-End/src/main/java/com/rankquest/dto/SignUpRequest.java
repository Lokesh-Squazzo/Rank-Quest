package com.rankquest.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SignUpRequest {
    private String username;
    private String email;
    private String password;
    private String rollNumber;
    private String college;
    private String branch;
    private String year;
}