package com.fiiconnect.api.auth_userMgmt.dtos.userProfileDTO;

import com.fiiconnect.api.auth_userMgmt.models.User;
import com.fiiconnect.api.auth_userMgmt.models.UserProfile;
import com.fiiconnect.api.social_secretary.classes.Achievement;
import lombok.Getter;

import java.util.List;

@Getter
public class UserProfileRequest {
    private final String firstName;
    private final String lastName;
    private final String email;
    private final String phone;
    private final String about;
    private final boolean twoFactorEnabled;
    private final String kycStatus;
    private final String currentYear;
    private final double rating;
    private final List<String> expertise;
    //ar trebui sa fie list de achievements
    private final List<String> achievements;
    private final String profilePicture;

    public UserProfileRequest(User user, UserProfile profile) {
        this.firstName = profile.getFirstName();
        this.lastName = profile.getLastName();
        this.phone = profile.getPhone();
        this.about = profile.getAbout();
        this.twoFactorEnabled = profile.isTwoFactorEnabled();
        this.kycStatus = profile.getKycStatus();
        this.currentYear = profile.getCurrentYear();
        this.rating = profile.getRating();
        this.expertise = profile.getExpertise();
        this.achievements = profile.getAchievements();
        this.profilePicture = profile.getProfilePicture();
        this.email = user.getEmail();
    }
}
