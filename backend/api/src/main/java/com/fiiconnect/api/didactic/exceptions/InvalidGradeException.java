package com.fiiconnect.api.didactic.exceptions;

public class InvalidGradeException extends RuntimeException {
    public InvalidGradeException(Long result) {
        super("Grade has value " + result + ", which is not in the interval [0, 10]");
    }
}
