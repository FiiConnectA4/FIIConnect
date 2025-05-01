package com.fiiconnect.api.didactic.exceptions;

public class FormulaNotFoundException extends RuntimeException {
    public FormulaNotFoundException(Long id) {
        super("Could not find formula with id " + id);
    }
}