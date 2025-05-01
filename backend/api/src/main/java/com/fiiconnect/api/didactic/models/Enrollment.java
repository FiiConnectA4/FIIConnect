package com.fiiconnect.api.didactic.models;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Transient;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
public class Enrollment {
    @EmbeddedId
    private EnrollmentCompositeKey id;
    private String facultyGroup;

    @Transient
    private Student student;

    @Transient
    private Course course;
}
