package com.fiiconnect.api.auth_userMgmt.dtos.personDTO;

public record StudentDTO(
        Long id,
        String cnp,
        String regNumber,
        String firstName,
        String lastName,
        Integer year,
        String facultyGroup
) {}
