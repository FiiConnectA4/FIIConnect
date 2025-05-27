package com.fiiconnect.api.didactic.exceptions;

public class FeedbackForProfessorNotFound extends RuntimeException {
  public FeedbackForProfessorNotFound(Long id) {
    super("Feedback for professor with id: " + id + " not found");
  }
}