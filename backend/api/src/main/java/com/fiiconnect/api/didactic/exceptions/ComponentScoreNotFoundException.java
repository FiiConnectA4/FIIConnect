package com.fiiconnect.api.didactic.exceptions;

import com.fiiconnect.api.didactic.models.ComponentScoreCompositeKey;

public class ComponentScoreNotFoundException extends RuntimeException {
  public ComponentScoreNotFoundException(ComponentScoreCompositeKey id) {
    super("Component score not found with ID: " + id);
  }

  public ComponentScoreNotFoundException(String message) {
    super(message);
  }
}
