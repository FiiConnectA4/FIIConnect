package com.fiiconnect.api.didactic.models;

import jakarta.persistence.Embeddable;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@EqualsAndHashCode
@Embeddable
public class StudCourseCompositeKey {
    private Long idStud;
    private Long idCourse;

    public StudCourseCompositeKey() {
    }

    public StudCourseCompositeKey(Long idStud, Long idCourse) {
        this.idStud = idStud;
        this.idCourse = idCourse;
    }
}
