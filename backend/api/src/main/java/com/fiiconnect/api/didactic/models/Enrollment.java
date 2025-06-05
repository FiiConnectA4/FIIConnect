package com.fiiconnect.api.didactic.models;

import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Transient;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Objects;

@Getter
@Setter
@Entity
@NoArgsConstructor
public class Enrollment {
    @EmbeddedId
    private EnrollmentCompositeKey id;
    private String facultyGroup;

    @Transient
    private Student student;

    @Transient
    private Course course;

    public Enrollment(EnrollmentCompositeKey enrollmentKey, String facultyGroup) {
        this.id = enrollmentKey;
        this.facultyGroup = facultyGroup;
    }

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Enrollment that)) return false;
        return Objects.equals(getId(), that.getId()) && Objects.equals(getFacultyGroup(), that.getFacultyGroup()) && Objects.equals(getStudent(), that.getStudent()) && Objects.equals(getCourse(), that.getCourse());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getFacultyGroup(), getStudent(), getCourse());
    }

    @Override
    public String toString() {
        return "Enrollment{" +
                "id=" + id +
                ", facultyGroup='" + facultyGroup + '\'' +
                ", student=" + student +
                ", course=" + course +
                '}';
    }
}
