package com.fiiconnect.api.didactic.models;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

import java.util.Objects;

@Getter
@Setter
@Embeddable
public class EnrollmentCompositeKey {
    private Long idStud;
    private Long idCourse;

    public EnrollmentCompositeKey() {
    }

    public EnrollmentCompositeKey(Long idStud, Long idCourse) {
        this.idStud = idStud;
        this.idCourse = idCourse;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof EnrollmentCompositeKey that)) return false;
        return Objects.equals(getIdStud(), that.getIdStud()) && Objects.equals(getIdCourse(), that.getIdCourse());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getIdStud(), getIdCourse());
    }

    @Override
    public String toString() {
        return "EnrollmentCompositeKey{" +
                "idStud=" + idStud +
                ", idCourse=" + idCourse +
                '}';
    }
}
