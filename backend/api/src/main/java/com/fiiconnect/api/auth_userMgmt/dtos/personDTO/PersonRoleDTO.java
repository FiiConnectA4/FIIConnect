package com.fiiconnect.api.auth_userMgmt.dtos.personDTO;

import com.fiiconnect.api.social_secretary.DTO.TagDTO;
import lombok.Getter;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class PersonRoleDTO {
    private Long userId;
    private String lastName;
    private String firstName;
    private String role;
    private Set<TagDTO> tags;

    public PersonRoleDTO() {}

    public PersonRoleDTO(Long id, String lastName,
                         String firstName,
                         String role,
                         Set<TagDTO> tags) {
        this.userId = id;
        this.lastName = lastName;
        this.firstName = firstName;
        this.role = role;
        this.tags = tags;
    }
}
