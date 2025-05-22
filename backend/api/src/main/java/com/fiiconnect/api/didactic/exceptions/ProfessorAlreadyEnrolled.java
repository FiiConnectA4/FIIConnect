package com.fiiconnect.api.didactic.exceptions;

public class ProfessorAlreadyEnrolled extends RuntimeException {
    public ProfessorAlreadyEnrolled(String cnp) {
        super("Professor with CNP: " + cnp + " already enrolled");
    }
}
