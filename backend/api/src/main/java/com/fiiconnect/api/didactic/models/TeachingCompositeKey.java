package com.fiiconnect.api.didactic.models;

import jakarta.persistence.Embeddable;
import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;
import java.util.Objects;

@Setter
@Getter
@Embeddable
public class TeachingCompositeKey implements Serializable {
    private Long idProf;
    private Long idCourse;

    public TeachingCompositeKey() {
    }

    public TeachingCompositeKey(Long idProf, Long idCourse) {
        this.idProf = idProf;
        this.idCourse = idCourse;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof TeachingCompositeKey that)) return false;
        return Objects.equals(getIdProf(), that.getIdProf()) && Objects.equals(getIdCourse(), that.getIdCourse());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getIdProf(), getIdCourse());
    }

    @Override
    public String toString() {
        return "TeachingCompositeKey{" +
                "idProf=" + idProf +
                ", idCourse=" + idCourse +
                '}';
    }
}
