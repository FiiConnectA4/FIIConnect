package com.fiiconnect.api.didactic.exceptions;

public class StudentNotEnrolledInCourse extends RuntimeException {
    public StudentNotEnrolledInCourse(Long studentId, Long courseId) {
        super("Student " + studentId + " is not enrolled in course " + courseId);
    }
}
