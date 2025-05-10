package com.fiiconnect.api.didactic.models;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Transient;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Setter
@Getter
@EqualsAndHashCode
@Entity
public class Grade {
    @EmbeddedId
    private GradeCompositeKey id;
    private Double value;
    private Date gradingDate;

    @Transient
    private Student student;

    public Grade() {
    }

    public Grade(GradeCompositeKey id, Double value, Date gradingDate) {
        this.id = id;
        this.value = value;
        this.gradingDate = gradingDate;
    }
}
