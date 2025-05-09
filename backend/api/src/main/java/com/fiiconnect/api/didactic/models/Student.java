package com.fiiconnect.api.didactic.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Objects;

@Entity
@Getter
@Setter
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "student_id_gen")
    @SequenceGenerator(name = "student_id_gen", sequenceName = "seq_student_id", allocationSize = 1)
    private Long id;
    private String cnp;
    private String regNumber;
    private String firstName, lastName;
    private Integer year;
    private String facultyGroup;

    @Transient
    private List<Enrollment> enrollments;

    @Override
    public boolean equals(Object o) {
        if (!(o instanceof Student student)) return false;
        return Objects.equals(getId(), student.getId()) && Objects.equals(getCnp(), student.getCnp()) && Objects.equals(getRegNumber(), student.getRegNumber()) && Objects.equals(getFirstName(), student.getFirstName()) && Objects.equals(getLastName(), student.getLastName()) && Objects.equals(getYear(), student.getYear()) && Objects.equals(getFacultyGroup(), student.getFacultyGroup()) && Objects.equals(getEnrollments(), student.getEnrollments());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getCnp(), getRegNumber(), getFirstName(), getLastName(), getYear(), getFacultyGroup(), getEnrollments());
    }

    @Override
    public String toString() {
        return "Student{" +
                "id=" + id +
                ", cnp='" + cnp + '\'' +
                ", regNumber='" + regNumber + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", year=" + year +
                ", facultyGroup='" + facultyGroup + '\'' +
                ", enrollments=" + enrollments +
                '}';
    }
}
