package com.rankquest.controller;

import com.rankquest.dto.ApiResponse;
import com.rankquest.dto.ChangePasswordRequest;
import com.rankquest.dto.UpdateProfileRequest;
import com.rankquest.dto.UserProfileResponse;
import com.rankquest.exception.BadRequestException;
import com.rankquest.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.Principal;
import java.util.Map;
import java.util.UUID;

@Slf4j
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final Path uploadDir = Paths.get("uploads", "avatars").toAbsolutePath().normalize();

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCurrentUserProfile(
            Principal principal,
            @RequestParam(required = false) String email) {
        String effectiveEmail = resolveEmail(principal, email);
        UserProfileResponse response = userService.getProfileByEmail(effectiveEmail);
        return ResponseEntity.ok(ApiResponse.success("Profile fetched", Map.of("user", response)));
    }

    @GetMapping("/profile-by-email")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getProfileByEmail(
            Principal principal,
            @RequestParam(required = false) String email) {
        String effectiveEmail = resolveEmail(principal, email);
        UserProfileResponse response = userService.getProfileByEmail(effectiveEmail);
        return ResponseEntity.ok(ApiResponse.success("Profile fetched", Map.of("user", response)));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updateUserProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            Principal principal,
            @RequestParam(required = false) String email) {
        String effectiveEmail = resolveEmail(principal, email);
        UserProfileResponse response = userService.updateUserProfile(effectiveEmail, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", Map.of("user", response)));
    }

    @PutMapping("/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @Valid @RequestBody ChangePasswordRequest request,
            Principal principal,
            @RequestParam(required = false) String email) {
        String effectiveEmail = resolveEmail(principal, email);
        userService.changePassword(effectiveEmail, request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
    }

    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ApiResponse<Map<String, Object>>> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            Principal principal,
            @RequestParam(required = false) String email) {
        String effectiveEmail = resolveEmail(principal, email);

        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Please select an image file to upload");
        }

        if (file.getSize() > 5 * 1024 * 1024) {
            throw new BadRequestException("File size must not exceed 5MB");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BadRequestException("Only image files (JPEG, PNG, WEBP, GIF, SVG) are allowed");
        }

        try {
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            } else {
                extension = ".png";
            }

            String uniqueFilename = UUID.randomUUID().toString() + extension;
            Path targetLocation = uploadDir.resolve(uniqueFilename).normalize();

            // Security check against directory traversal
            if (!targetLocation.startsWith(uploadDir)) {
                throw new BadRequestException("Invalid file path");
            }

            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            String avatarUrl = "/api/users/avatar/" + uniqueFilename;
            UserProfileResponse updatedUser = userService.updateAvatar(effectiveEmail, avatarUrl);

            return ResponseEntity.ok(ApiResponse.success("Avatar uploaded successfully", Map.of(
                    "avatarUrl", avatarUrl,
                    "user", updatedUser
            )));
        } catch (IOException e) {
            log.error("Failed to save avatar image", e);
            throw new BadRequestException("Failed to upload avatar image: " + e.getMessage());
        }
    }

    @GetMapping("/avatar/{filename:.+}")
    public ResponseEntity<Resource> getAvatar(@PathVariable String filename) {
        try {
            Path filePath = uploadDir.resolve(filename).normalize();
            if (!filePath.startsWith(uploadDir) || !Files.exists(filePath)) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = new UrlResource(filePath.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                return ResponseEntity.notFound().build();
            }

            MediaType mediaType = MediaTypeFactory.getMediaType(filename)
                    .orElse(MediaType.APPLICATION_OCTET_STREAM);

            return ResponseEntity.ok()
                    .contentType(mediaType)
                    .header(HttpHeaders.CACHE_CONTROL, "max-age=86400, public")
                    .body(resource);
        } catch (Exception e) {
            log.error("Error retrieving avatar {}", filename, e);
            return ResponseEntity.notFound().build();
        }
    }

    private String resolveEmail(Principal principal, String emailParam) {
        if (principal != null && StringUtils.hasText(principal.getName())) {
            return principal.getName();
        }
        if (StringUtils.hasText(emailParam)) {
            return emailParam;
        }
        throw new BadRequestException("User email could not be determined. Please authenticate or provide email.");
    }
}