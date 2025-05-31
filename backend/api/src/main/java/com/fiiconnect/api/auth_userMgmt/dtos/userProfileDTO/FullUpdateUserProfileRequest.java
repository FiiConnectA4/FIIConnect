package com.fiiconnect.api.auth_userMgmt.dtos.userProfileDTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FullUpdateUserProfileRequest {
    private String firstName;
    private String lastName;
    private String phone;
    private String about;
    private String kycStatus;
    private boolean twoFactorEnabled;
    private String currentYear;
    private int rating;
}
