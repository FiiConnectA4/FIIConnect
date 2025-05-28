package com.fiiconnect.api.auth_userMgmt.dtos;

public record StudentDTO(
        Long id,
        String cnp,
        String regNumber,
        String firstName,
        String lastName,
        Integer year,
        String facultyGroup
) {}
