package com.fiiconnect.api.didactic.models;


import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class TransferRequest {

    @EmbeddedId
    StudCourseCompositeKey id;

    String facultyGroup;
    String reasonText;
    Date requestDate;

}
