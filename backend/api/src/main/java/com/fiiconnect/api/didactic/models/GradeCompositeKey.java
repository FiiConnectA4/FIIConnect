package com.fiiconnect.api.didactic.models;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

import java.io.Serializable;

@Embeddable
public class GradeCompositeKey implements Serializable {
    @Column(name = "id_stud")
    private Long idStud;

    @Column(name = "id_course")
    private Long idCourse;

    public GradeCompositeKey() {}

    public GradeCompositeKey(Long idStud, Long idCourse) {
        this.idStud = idStud;
        this.idCourse = idCourse;
    }

    // Getters, Setters, equals() și hashCode()
}
