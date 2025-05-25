package com.fiiconnect.api.auth_userMgmt.dtos;

import com.fiiconnect.api.social_secretary.DTO.TagDTO;

import java.util.List;
import java.util.Set;

public record PersonInfoDTO(
        Long userId,
        String username,
        String email,
        String role,
        StudentDTO student,
        ProfessorDTO professor,
        Set<TagDTO> tags
        /// am adaugat asta
) {}
