package com.fiiconnect.api.auth_userMgmt.dtos;

public record PersonInfoDTO(
        Long userId,
        String username,
        String email,
        String role,
        StudentDTO student,
        ProfessorDTO professor
) {}
