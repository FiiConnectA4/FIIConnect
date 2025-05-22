package com.fiiconnect.api.didactic.exceptions;

public class StudentAlreadyEnrolledInCourse extends RuntimeException {
    public StudentAlreadyEnrolledInCourse(Long studentId, Long courseId) {
        super("Student with ID: " + studentId + " already enrolled in course with ID: " + courseId);
    }
}
