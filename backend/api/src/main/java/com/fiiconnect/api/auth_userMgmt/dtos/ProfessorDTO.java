package com.fiiconnect.api.auth_userMgmt.dtos;

public record ProfessorDTO(
        Long id,
        String cnp,
        String firstName,
        String lastName,
        String rank
) {}
