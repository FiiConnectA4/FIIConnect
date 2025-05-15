package com.fiiconnect.api.auth_userMgmt.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateUserProfileRequest {
    private String firstName;
    private String lastName;
    private String phone;
    private String about;
    private boolean twoFactorEnabled;
}