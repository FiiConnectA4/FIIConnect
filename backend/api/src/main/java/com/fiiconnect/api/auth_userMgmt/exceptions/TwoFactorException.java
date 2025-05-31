package com.fiiconnect.api.auth_userMgmt.exceptions;

public class TwoFactorException extends RuntimeException {
    public TwoFactorException(String message) {
        super(message);
    }
}