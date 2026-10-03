package com.rankquest;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rankquest.dto.ChangePasswordRequest;
import com.rankquest.dto.LoginRequest;
import com.rankquest.dto.ResetPasswordRequest;
import com.rankquest.dto.SignUpRequest;
import com.rankquest.dto.UpdateProfileRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.notNullValue;
import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class ProfileAndPasswordIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Reset Password Workflow (Forgot Password)")
    void testResetPasswordWorkflow() throws Exception {
        String email = "resetuser@example.com";
        SignUpRequest signUpRequest = SignUpRequest.builder()
                .username("resetuser")
                .email(email)
                .password("oldSecret123")
                .rollNumber("ROLL101")
                .college("Engineering College")
                .build();

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signUpRequest)))
                .andExpect(status().isOk());

        // 1. Reset Password with matching roll number
        ResetPasswordRequest resetRequest = ResetPasswordRequest.builder()
                .email(email)
                .rollNumber("ROLL101")
                .newPassword("brandNewPassword456")
                .build();

        mockMvc.perform(post("/api/auth/reset-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(resetRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // 2. Old password should fail login
        LoginRequest failedLogin = LoginRequest.builder()
                .email(email)
                .password("oldSecret123")
                .build();

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(failedLogin)))
                .andExpect(status().isBadRequest());

        // 3. New password should succeed login
        LoginRequest successfulLogin = LoginRequest.builder()
                .email(email)
                .password("brandNewPassword456")
                .build();

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(successfulLogin)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.token").exists());
    }

    @Test
    @DisplayName("Authenticated Change Password and Avatar Upload")
    void testChangePasswordAndAvatarUpload() throws Exception {
        String email = "avataruser@example.com";
        SignUpRequest signUpRequest = SignUpRequest.builder()
                .username("avataruser")
                .email(email)
                .password("initialPass123")
                .build();

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signUpRequest)))
                .andExpect(status().isOk());

        // Login to get JWT
        LoginRequest loginRequest = LoginRequest.builder()
                .email(email)
                .password("initialPass123")
                .build();

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode rootNode = objectMapper.readTree(loginResult.getResponse().getContentAsString());
        String token = rootNode.path("data").path("token").asText();

        // 1. Change Password
        ChangePasswordRequest changePasswordRequest = ChangePasswordRequest.builder()
                .currentPassword("initialPass123")
                .newPassword("updatedSecurePass789")
                .build();

        mockMvc.perform(put("/api/users/password")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(changePasswordRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // 2. Upload Avatar Image
        MockMultipartFile mockFile = new MockMultipartFile(
                "file",
                "profile.png",
                MediaType.IMAGE_PNG_VALUE,
                "fake image content bytes".getBytes()
        );

        MvcResult avatarResult = mockMvc.perform(multipart("/api/users/avatar")
                        .file(mockFile)
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.avatarUrl", startsWith("/api/users/avatar/")))
                .andReturn();

        JsonNode avatarNode = objectMapper.readTree(avatarResult.getResponse().getContentAsString());
        String avatarUrl = avatarNode.path("data").path("avatarUrl").asText();

        // 3. Fetch uploaded avatar image via GET
        mockMvc.perform(get(avatarUrl))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.IMAGE_PNG));

        // 4. Update profile with custom avatar URL directly
        UpdateProfileRequest profileRequest = UpdateProfileRequest.builder()
                .bio("Updated bio with avatar")
                .avatarUrl("https://api.dicebear.com/7.x/bottts/svg?seed=coder")
                .build();

        mockMvc.perform(put("/api/users/profile")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(profileRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.user.avatarUrl").value("https://api.dicebear.com/7.x/bottts/svg?seed=coder"));
    }
}
