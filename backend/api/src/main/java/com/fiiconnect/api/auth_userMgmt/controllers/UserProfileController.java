package com.fiiconnect.api.auth_userMgmt.controllers;

import com.fiiconnect.api.auth_userMgmt.dtos.FullUpdateUserProfileRequest;
import com.fiiconnect.api.auth_userMgmt.dtos.UserProfileRequest;
import com.fiiconnect.api.auth_userMgmt.dtos.UpdateUserProfileRequest;
import com.fiiconnect.api.auth_userMgmt.models.User;
import com.fiiconnect.api.auth_userMgmt.models.UserProfile;
import com.fiiconnect.api.auth_userMgmt.repositories.UserRepository;
import com.fiiconnect.api.auth_userMgmt.services.UserProfileService;
import jakarta.annotation.security.RolesAllowed;
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

        if (dto.getPhone() != null)
            profile.setPhone(dto.getPhone());

        if (dto.getAbout() != null)
            profile.setAbout(dto.getAbout());

        if (dto.getFirstName() != null)
            profile.setFirstName(dto.getFirstName());

        if (dto.getLastName() != null)
            profile.setLastName(dto.getLastName());

        profileService.updateProfile(profile);
        return ResponseEntity.ok(profile);
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

    @PutMapping("/admin/{username}")
    @RolesAllowed({"ROLE_ADMIN", "ROLE_PROFESOR"})
    public ResponseEntity<?> adminUpdateProfile(@PathVariable String username,
                                                @RequestBody FullUpdateUserProfileRequest dto) {
        User user = userRepository.findByUsername(username);
        if (user == null) return ResponseEntity.notFound().build();

        UserProfile profile = profileService.getByUser(user);
        if (profile == null) return ResponseEntity.notFound().build();

        profile.setFirstName(dto.getFirstName());
        profile.setLastName(dto.getLastName());
        profile.setPhone(dto.getPhone());
        profile.setAbout(dto.getAbout());
        profile.setKycStatus(dto.getKycStatus());
        profile.setTwoFactorEnabled(dto.isTwoFactorEnabled());
        profile.setCurrentYear(dto.getCurrentYear());
        profile.setRating(dto.getRating());

        profileService.updateProfile(profile);
        return ResponseEntity.ok("Profil actualizat cu succes");
    }
}
