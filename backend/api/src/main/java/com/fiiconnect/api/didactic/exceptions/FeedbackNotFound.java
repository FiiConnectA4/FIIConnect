package com.fiiconnect.api.didactic.exceptions;

public class FeedbackNotFound extends RuntimeException {
    public FeedbackNotFound(Long studentId, Long profId) {
        super("Could not find feedback from student: " + studentId + ", profId: " + profId);
    }
}
