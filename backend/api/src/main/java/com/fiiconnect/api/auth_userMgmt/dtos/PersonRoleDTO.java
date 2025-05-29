package com.fiiconnect.api.auth_userMgmt.dtos;

import com.fiiconnect.api.social_secretary.DTO.TagDTO;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Set;

@Getter
@Setter
public class PersonRoleDTO {
    private String lastName;
    private String firstName;
    private String role;
    private Set<TagDTO> tags;

    public PersonRoleDTO() {}

    public PersonRoleDTO(String lastName,
                         String firstName,
                         String role,
                         Set<TagDTO> tags) {
        this.lastName = lastName;
        this.firstName = firstName;
        this.role = role;
        this.tags = tags;
    }
}
