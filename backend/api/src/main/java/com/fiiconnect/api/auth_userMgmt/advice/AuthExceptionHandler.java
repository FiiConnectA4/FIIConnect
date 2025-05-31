package com.fiiconnect.api.auth_userMgmt.advice;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Prinde excepțiile de autentificare sau autorizare
 * *DOAR* pentru controllerele din pachetul com.fiiconnect.api.auth_userMgmt.controllers
 */
@ControllerAdvice(basePackages = "com.fiiconnect.api.auth_userMgmt.controllers")
public class AuthExceptionHandler {

    /**
     * Handler pentru orice excepție de tip AuthenticationException (ex: credentiale greșite,
     * token invalid, user neautentificat etc.).
     *
     * Valoarea implicită a HttpStatus-ului este 401 UNAUTHORIZED.
     */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<String> handleAuthenticationException(AuthenticationException ex) {
        // Poți loga ex.getMessage() sau ex.printStackTrace() dacă vrei mai multe detalii
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("Autentificare eșuată: " + ex.getMessage());
    }

    /**
     * Handler pentru AccessDeniedException (ex: user autentificat, dar fără rolul/permisiunea
     * necesară pentru a accesa resursa).
     *
     * Va returna 403 FORBIDDEN.
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<String> handleAccessDeniedException(AccessDeniedException ex) {
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body("Acces interzis: " + ex.getMessage());
    }

    /**
     * (Opțional) Dacă vrei să prinzi și alte excepții legate de securitate—notificărilor,
     * token-uri expirate etc.—le poți adăuga aici.
     */
}