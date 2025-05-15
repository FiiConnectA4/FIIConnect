package com.fiiconnect.api.auth_userMgmt.controllers;

import com.fiiconnect.api.auth_userMgmt.dtos.UpdateUserProfileRequest;
import com.fiiconnect.api.auth_userMgmt.dtos.UserProfileRequest;
import com.fiiconnect.api.auth_userMgmt.models.User;
import com.fiiconnect.api.auth_userMgmt.models.UserProfile;
import com.fiiconnect.api.auth_userMgmt.repositories.UserRepository;
import com.fiiconnect.api.auth_userMgmt.services.UserProfileService;
import com.fiiconnect.api.didactic.services.SftpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Objects;

@RestController
@RequestMapping("/profile")
public class UserProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileService profileService;

    @Autowired
    private SftpService sftpService;

    private final String PROFILE_FOLDER = "faculty_files/profile_pictures/";

    @GetMapping
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername());
        UserProfile profile = profileService.getByUser(user);

        if (profile == null) {
            return ResponseEntity.status(404).body("Profile not found");
        }

        return ResponseEntity.ok(new UserProfileRequest(user, profile));
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal UserDetails userDetails,
                                           @RequestBody UpdateUserProfileRequest dto) {
        User user = userRepository.findByUsername(userDetails.getUsername());
        UserProfile profile = profileService.getByUser(user);

        profile.setPhone(dto.getPhone());
        profile.setAbout(dto.getAbout());
        profile.setFirstName(dto.getFirstName());
        profile.setLastName(dto.getLastName());

        profileService.updateProfile(profile);
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/setup")
    public ResponseEntity<?> createProfile(@AuthenticationPrincipal UserDetails userDetails,
                                           @RequestBody UpdateUserProfileRequest dto) {
        User user = userRepository.findByUsername(userDetails.getUsername());

        if (profileService.getByUser(user) != null) {
            return ResponseEntity.badRequest().body("Profilul există deja");
        }

        UserProfile profile = new UserProfile();
        profile.setUser(user);
        profile.setFirstName(dto.getFirstName());
        profile.setLastName(dto.getLastName());
        profile.setPhone(dto.getPhone());
        profile.setAbout(dto.getAbout());
        profile.setKycStatus("Unverified");
        profile.setTwoFactorEnabled(false);
        profile.setCurrentYear("Not set");
        profile.setRating(0);
        profileService.updateProfile(profile);

        return ResponseEntity.ok("Profil creat cu succes");
    }

    @PostMapping("/photo")
    public ResponseEntity<?> uploadProfilePhoto(@AuthenticationPrincipal UserDetails userDetails,
                                                @RequestParam("file") MultipartFile file) throws IOException {
        User user = userRepository.findByUsername(userDetails.getUsername());
        UserProfile profile = profileService.getByUser(user);

        if (profile == null) {
            return ResponseEntity.status(404).body("Profile not found");
        }

        String filename = "profile-" + user.getId() + getExtension(Objects.requireNonNull(file.getOriginalFilename()));

        // ✅ Upload pe SFTP
        sftpService.uploadFile(file, PROFILE_FOLDER, filename);

        // ✅ Salvează numele pozei în UserProfile
        profile.setProfilePicture(filename);
        profileService.updateProfile(profile);

        return ResponseEntity.ok("Poza a fost încărcată");
    }

    @GetMapping("/photo")
    public ResponseEntity<Resource> getProfilePhoto(@AuthenticationPrincipal UserDetails userDetails) throws IOException {
        User user = userRepository.findByUsername(userDetails.getUsername());
        UserProfile profile = profileService.getByUser(user);

        if (profile == null || profile.getProfilePicture() == null) {
            return ResponseEntity.status(404).build();
        }

        // ✅ Descarcă fișierul din SFTP în local folder
        File file = sftpService.downloadFile(PROFILE_FOLDER + profile.getProfilePicture(),
                profile.getProfilePicture());

        Path path = file.toPath();
        Resource resource;
        try {
            resource = new UrlResource(path.toUri());
        } catch (MalformedURLException e) {
            throw new RuntimeException("Eroare la citirea imaginii", e);
        }

        String contentType = Files.probeContentType(path);
        if (contentType == null) {
            contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getName() + "\"")
                .body(resource);
    }

    private String getExtension(String filename) {
        return filename.substring(filename.lastIndexOf("."));
    }
}
