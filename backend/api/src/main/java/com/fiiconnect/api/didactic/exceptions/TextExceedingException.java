package com.fiiconnect.api.didactic.exceptions;

public class TextExceedingException extends RuntimeException {
    public TextExceedingException(int provided, int limit) {
        super("Text exceeds provided limit, provided text: " + provided + "characters. Provided limit: " + limit);
    }
}
