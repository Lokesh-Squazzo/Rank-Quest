package com.rankquest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.rankquest.dto.LoginRequest;
import com.rankquest.dto.ProblemRequest;
import com.rankquest.dto.SignUpRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AdminProblemIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String getAdminToken() throws Exception {
        LoginRequest loginRequest = LoginRequest.builder()
                .email("admin@rankquest.com")
                .password("admin123")
                .build();

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        return objectMapper.readTree(result.getResponse().getContentAsString())
                .path("data").path("token").asText();
    }

    private String getNormalUserToken() throws Exception {
        SignUpRequest signUpRequest = SignUpRequest.builder()
                .username("standarduser")
                .email("standard@example.com")
                .password("password123")
                .college("Test College")
                .branch("CS")
                .year("2nd")
                .build();

        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signUpRequest)));

        LoginRequest loginRequest = LoginRequest.builder()
                .email("standard@example.com")
                .password("password123")
                .build();

        MvcResult result = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn();

        return objectMapper.readTree(result.getResponse().getContentAsString())
                .path("data").path("token").asText();
    }

    @Test
    @DisplayName("Admin can create a problem, while non-admin is forbidden")
    void testCreateProblemSecurity() throws Exception {
        String adminToken = getAdminToken();
        String userToken = getNormalUserToken();

        ProblemRequest request = ProblemRequest.builder()
                .title("Unique Admin Test Problem")
                .description("Test problem created by admin")
                .difficulty("Medium")
                .acceptance("75.0%")
                .points(20)
                .testCases("[{\"input\":\"1\",\"output\":\"1\"}]")
                .build();

        // 1. Regular user should receive 403 Forbidden
        mockMvc.perform(post("/api/admin/problems")
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());

        // 2. Admin should receive 201 Created
        mockMvc.perform(post("/api/admin/problems")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("Unique Admin Test Problem"))
                .andExpect(jsonPath("$.data.points").value(20));
    }

    @Test
    @DisplayName("Admin can update an existing problem, while non-admin is forbidden")
    void testUpdateProblemSecurity() throws Exception {
        String adminToken = getAdminToken();
        String userToken = getNormalUserToken();

        // 1. Create a problem to update
        ProblemRequest initial = ProblemRequest.builder()
                .title("Problem Before Update")
                .description("Initial description")
                .difficulty("Easy")
                .acceptance("90.0%")
                .points(10)
                .testCases("[]")
                .build();

        MvcResult createResult = mockMvc.perform(post("/api/admin/problems")
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(initial)))
                .andExpect(status().isCreated())
                .andReturn();

        long problemId = objectMapper.readTree(createResult.getResponse().getContentAsString())
                .path("data").path("id").asLong();

        ProblemRequest updated = ProblemRequest.builder()
                .title("Problem After Update")
                .description("Updated description")
                .difficulty("Hard")
                .acceptance("30.0%")
                .points(25)
                .testCases("[{\"input\":\"2\",\"output\":\"4\"}]")
                .build();

        // 2. Regular user should receive 403 Forbidden
        mockMvc.perform(put("/api/admin/problems/" + problemId)
                        .header("Authorization", "Bearer " + userToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isForbidden());

        // 3. Admin should receive 200 OK with updated fields
        mockMvc.perform(put("/api/admin/problems/" + problemId)
                        .header("Authorization", "Bearer " + adminToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("Problem After Update"))
                .andExpect(jsonPath("$.data.difficulty").value("Hard"))
                .andExpect(jsonPath("$.data.points").value(25));
    }
}

