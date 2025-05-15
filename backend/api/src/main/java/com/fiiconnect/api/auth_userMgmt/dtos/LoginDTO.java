package com.fiiconnect.api.auth_userMgmt.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    private String username;
    private String password;
    private String twoFactorCode;
}