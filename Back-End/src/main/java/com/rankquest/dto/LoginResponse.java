package com.rankquest.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LoginResponse {
    private boolean success;
    private String message;
    private Object data;

    // Constructor 1: For simple success/error messages (Used in Signup)
    public LoginResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
        this.data = null;
    }

    // Constructor 2: For responses with data (Used in Login to send User object)
    public LoginResponse(boolean success, String message, Object data) {
        this.success = success;
        this.message = message;
        this.data = data;
    }
}