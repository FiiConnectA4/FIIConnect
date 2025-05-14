package com.fiiconnect.api.auth_userMgmt.controllers;

import com.fiiconnect.api.auth_userMgmt.dtos.UserProfileRequest;
import com.fiiconnect.api.auth_userMgmt.dtos.UpdateUserProfileRequest;
import com.fiiconnect.api.auth_userMgmt.models.User;
import com.fiiconnect.api.auth_userMgmt.models.UserProfile;
import com.fiiconnect.api.auth_userMgmt.repositories.UserRepository;
import com.fiiconnect.api.auth_userMgmt.services.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/profile")
public class UserProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileService profileService;

    @GetMapping
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByUsername(userDetails.getUsername());
        UserProfile profile = profileService.getByUser(user);

        if (profile == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profile not found");
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

}
