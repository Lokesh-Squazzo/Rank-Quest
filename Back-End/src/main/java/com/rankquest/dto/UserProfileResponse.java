package com.rankquest.dto;

import com.rankquest.model.User;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserProfileResponse {
    private Long id;
    private String name;
    private String email;
    private String rollNumber;
    private String college;
    private String branch;
    private String year;
    private String location;
    private String bio;
    private String role;

    // --- NEW FIELDS FOR RANKING ---
    private int totalScore;
    private int problemsSolved;

    public UserProfileResponse(User user) {
        this.id = user.getId();
        this.name = user.getUsername();
        this.email = user.getEmail();
        this.rollNumber = user.getRollNumber();
        this.college = user.getCollege();
        this.branch = user.getBranch();
        this.year = user.getYear();
        this.location = user.getLocation();
        this.bio = user.getBio();
        this.role = user.getRole().name();

        // Map the stats
        this.totalScore = user.getTotalScore();
        this.problemsSolved = user.getProblemsSolved();
    }
}