package com.fiiconnect.api.didactic.exceptions;

public class UnauthorizedOperationException extends RuntimeException {
    public UnauthorizedOperationException(String message) {
        super(message);
    }
    public UnauthorizedOperationException() {
        super("Unauthorized operation");
    }
}
