package com.rankquest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rankquest.dto.LoginRequest;
import com.rankquest.dto.SignUpRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Registration, Login with JWT, and Protected Profile Access")
    void testAuthWorkflowWithJwt() throws Exception {
        SignUpRequest signUpRequest = SignUpRequest.builder()
                .username("testjwtuser")
                .email("testjwt@example.com")
                .password("password123")
                .college("Test University")
                .branch("CSE")
                .year("3rd")
                .build();

        // 1. Sign Up
        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signUpRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // 2. Login
        LoginRequest loginRequest = LoginRequest.builder()
                .email("testjwt@example.com")
                .password("password123")
                .build();

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.token", notNullValue()))
                .andExpect(jsonPath("$.data.token", startsWith("eyJ"))) // Standard JWT header eyJ...
                .andReturn();

        String responseBody = loginResult.getResponse().getContentAsString();
        String token = objectMapper.readTree(responseBody).path("data").path("token").asText();

        // 3. Unauthenticated access to protected endpoint should fail with 401
        mockMvc.perform(get("/api/users/profile"))
                .andExpect(status().isUnauthorized());

        // 4. Authenticated access with Bearer token should succeed
        mockMvc.perform(get("/api/users/profile")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.user.email").value("testjwt@example.com"))
                .andExpect(jsonPath("$.data.user.username").value("testjwtuser"));
    }

    @Test
    @DisplayName("Validation failure on invalid signup request")
    void testSignUpValidationFailure() throws Exception {
        SignUpRequest invalidRequest = SignUpRequest.builder()
                .username("ab")
                .email("not-an-email")
                .password("123")
                .build();

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidRequest)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.data.username").value("Username must be between 3 and 50 characters"))
                .andExpect(jsonPath("$.data.email").value("Email must be a valid email address"))
                .andExpect(jsonPath("$.data.password").value("Password must be at least 6 characters"));
    }

    @Test
    @DisplayName("Submit problem solution and retrieve history")
    void testSubmissionAndHistory() throws Exception {
        SignUpRequest signUpRequest = SignUpRequest.builder()
                .username("coder1")
                .email("coder1@example.com")
                .password("password123")
                .college("Coding Institute")
                .branch("IT")
                .year("4th")
                .build();

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signUpRequest)))
                .andExpect(status().isOk());

        LoginRequest loginRequest = LoginRequest.builder()
                .email("coder1@example.com")
                .password("password123")
                .build();

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        String token = objectMapper.readTree(loginResult.getResponse().getContentAsString())
                .path("data").path("token").asText();

        // Submit solution for problem 1
        com.rankquest.dto.SubmissionRequest submissionRequest = com.rankquest.dto.SubmissionRequest.builder()
                .code("class Solution { public static void main(String[] args) {} }")
                .language("java")
                .status("ACCEPTED")
                .build();

        mockMvc.perform(post("/api/submissions/1")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(submissionRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.problemId").value(1))
                .andExpect(jsonPath("$.data.status").value("ACCEPTED"));

        // Retrieve submission history
        mockMvc.perform(get("/api/submissions/my-history")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data[0].problemId").value(1))
                .andExpect(jsonPath("$.data[0].status").value("ACCEPTED"));
    }
}


