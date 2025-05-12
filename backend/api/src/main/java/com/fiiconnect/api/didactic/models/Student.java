package com.fiiconnect.api.didactic.models;

import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;
import java.util.Objects;

@Entity
@Getter
@Setter
@EqualsAndHashCode
@ToString
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

    @Transient
    private List<Grade> grades;
}
