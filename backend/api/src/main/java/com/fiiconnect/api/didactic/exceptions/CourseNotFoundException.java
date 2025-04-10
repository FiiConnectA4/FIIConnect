package com.fiiconnect.api.didactic.exceptions;

public class CourseNotFoundException extends RuntimeException {
    public CourseNotFoundException(Long id) {
        super("Could not find course with id: " + id);
    }
}
