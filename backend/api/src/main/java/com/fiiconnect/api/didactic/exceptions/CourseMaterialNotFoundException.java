package com.fiiconnect.api.didactic.exceptions;

public class CourseMaterialNotFoundException extends RuntimeException {
    public CourseMaterialNotFoundException(Long id) {
        super("Could not find course material with id: " + id);
    }
}
