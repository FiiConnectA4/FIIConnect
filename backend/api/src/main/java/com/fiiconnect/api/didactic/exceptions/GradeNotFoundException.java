package com.fiiconnect.api.didactic.exceptions;

import com.fiiconnect.api.didactic.models.GradeCompositeKey;

public class GradeNotFoundException extends RuntimeException {
  public GradeNotFoundException(GradeCompositeKey id) {
    super("Grade not found with ID: " + id);
  }

  public GradeNotFoundException(String message) {
    super(message);
  }
}
