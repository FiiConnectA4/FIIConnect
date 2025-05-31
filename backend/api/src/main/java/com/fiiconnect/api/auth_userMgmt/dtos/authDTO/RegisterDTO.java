package com.fiiconnect.api.auth_userMgmt.dtos.authDTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterDTO {
    private String username;
    private String password;
    private String email;
    private String role;

    private Long studentId;
    private Long professorId;
}
