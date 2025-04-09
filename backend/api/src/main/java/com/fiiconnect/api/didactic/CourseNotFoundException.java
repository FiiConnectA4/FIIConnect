package com.fiiconnect.api.didactic;

public class CourseNotFoundException extends Exception {
    public CourseNotFoundException(Long id) {
        super("Could not find course with id: " + id);
    }
}
