package com.fiiconnect.api.auth_userMgmt.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UnassignedPersonDTO {
    private Long   entityId;
    private String firstName;
    private String lastName;
    private String role;

    public UnassignedPersonDTO() {}

    public UnassignedPersonDTO(Long entityId, String firstName, String lastName, String role) {
        this.entityId  = entityId;
        this.firstName = firstName;
        this.lastName  = lastName;
        this.role      = role;
    }
}
