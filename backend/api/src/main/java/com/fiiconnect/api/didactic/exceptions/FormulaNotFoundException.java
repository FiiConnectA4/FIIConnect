package com.fiiconnect.api.didactic.exceptions;

public class FormulaNotFoundException extends RuntimeException {
    public FormulaNotFoundException(Long id) {
        super("Formula not found with ID: " + id);
    }

    public FormulaNotFoundException(String message) {
        super(message);
    }
}
