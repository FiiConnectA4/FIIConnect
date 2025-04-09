package com.fiiconnect.api.didactic;

public class ProfessorNotFoundException extends RuntimeException {
    public ProfessorNotFoundException(Long id) {
        super("Could not find professor with id: " + id);
    }
}
