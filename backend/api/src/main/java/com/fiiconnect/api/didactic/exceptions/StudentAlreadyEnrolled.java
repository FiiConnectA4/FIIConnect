package com.fiiconnect.api.didactic.exceptions;

public class StudentAlreadyEnrolled extends RuntimeException {
    public StudentAlreadyEnrolled(String cnp) {
        super("Student with CNP: " + cnp + " already enrolled");
    }
}
