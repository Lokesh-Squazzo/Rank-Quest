package com.rankquest.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class LoginResponse extends ApiResponse<Object> {

    public LoginResponse(boolean success, String message) {
        super(success, message, null);
    }

    public LoginResponse(boolean success, String message, Object data) {
        super(success, message, data);
    }
}