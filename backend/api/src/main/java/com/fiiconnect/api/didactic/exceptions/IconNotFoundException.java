package com.fiiconnect.api.didactic.exceptions;

public class IconNotFoundException extends RuntimeException {
    public IconNotFoundException(Long id) {
        super("Could not find icon attached to course with id: " + id);
    }
}
