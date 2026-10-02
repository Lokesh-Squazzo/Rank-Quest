package com.rankquest.dto;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateProfileRequest {
    private String name;
    private String rollNumber;
    private String college;
    private String branch;
    private String year;
    private String location;

    @Size(max = 1000, message = "Bio must not exceed 1000 characters")
    private String bio;
}