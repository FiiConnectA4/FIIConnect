package com.fiiconnect.api.didactic.exceptions;

public class FeedbackFromStudentNotFound extends RuntimeException {
    public FeedbackFromStudentNotFound(Long id) {
        super("Feedback from student with id: " + id + " not found");
    }
}
