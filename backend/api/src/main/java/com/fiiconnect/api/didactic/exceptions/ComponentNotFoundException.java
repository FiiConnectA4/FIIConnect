package com.fiiconnect.api.didactic.exceptions;

public class ComponentNotFoundException extends RuntimeException {
  public ComponentNotFoundException(Long id) {
    super("Component not found with ID: " + id);
  }

  public ComponentNotFoundException(String message) {
    super(message);
  }
}
