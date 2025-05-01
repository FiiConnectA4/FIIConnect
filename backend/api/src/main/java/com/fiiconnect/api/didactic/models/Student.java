package com.fiiconnect.api.didactic.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "student_id_gen")
    @SequenceGenerator(name = "student_id_gen", sequenceName = "seq_student_id", allocationSize = 1, initialValue = 1)
    private Long id;
    private String cnp;
    private String regNumber;
    private String firstName, lastName;
    private Integer year;
    private String facultyGroup;

    @Transient
    private List<Enrollment> enrollments;
}
