package com.fiiconnect.api.didactic.exceptions;

import com.fiiconnect.api.didactic.models.StudCourseCompositeKey;

public class GradeNotFoundException extends RuntimeException {
  public GradeNotFoundException(StudCourseCompositeKey id) {
    super("Grade not found with ID: " + id);
  }

  public GradeNotFoundException(String message) {
    super(message);
  }
}
