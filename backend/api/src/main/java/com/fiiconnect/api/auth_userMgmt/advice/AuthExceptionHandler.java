package com.fiiconnect.api.auth_userMgmt.advice;

import com.fiiconnect.api.auth_userMgmt.core.ApiResponse;
import com.fiiconnect.api.auth_userMgmt.exceptions.BadRequestException;
import com.fiiconnect.api.auth_userMgmt.exceptions.TwoFactorException;
import com.fiiconnect.api.auth_userMgmt.exceptions.UserNotFoundException;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.security.SignatureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

/**
 * Prinde excepțiile de autentificare, autorizare, validare și cele de tip JWT
 * *DOAR* pentru controllerele din pachetul com.fiiconnect.api.auth_userMgmt.controllers
 */
@ControllerAdvice(basePackages = "com.fiiconnect.api.auth_userMgmt.controllers")
public class AuthExceptionHandler {

    /**
     * Handler pentru orice excepție de tip AuthenticationException (ex: credentiale greșite,
     * token invalid, user neautentificat etc.).
     * <p>
     * Va returna 401 UNAUTHORIZED cu payload JSON.
     */
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiResponse> handleAuthenticationException(AuthenticationException ex) {
        ApiResponse resp = new ApiResponse("Autentificare eșuată: " + ex.getMessage(), false);
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(resp);
    }

    /**
     * Handler pentru AccessDeniedException (ex: user autentificat, dar fără rolul/permisiunea
     * necesară pentru a accesa resursa).
     * <p>
     * Va returna 403 FORBIDDEN cu payload JSON.
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse> handleAccessDeniedException(AccessDeniedException ex) {
        ApiResponse resp = new ApiResponse("Acces interzis: " + ex.getMessage(), false);
        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(resp);
    }

    /**
     * Handler pentru BadRequestException (validări incorecte, date lipsă, formate invalide etc.).
     * <p>
     * Va returna 400 BAD_REQUEST cu payload JSON.
     */
    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse> handleBadRequestException(BadRequestException ex) {
        ApiResponse resp = new ApiResponse("Cerere invalidă: " + ex.getMessage(), false);
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(resp);
    }

    /**
     * Handler pentru UserNotFoundException (când user-ul nu există).
     * <p>
     * Va returna 404 NOT_FOUND cu payload JSON.
     */
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiResponse> handleUserNotFoundException(UserNotFoundException ex) {
        ApiResponse resp = new ApiResponse(ex.getMessage(), false);
        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(resp);
    }

    /**
     * Handler pentru TwoFactorException (erori legate de 2FA, cod invalid etc.).
     * <p>
     * Va returna 400 BAD_REQUEST cu payload JSON.
     */
    @ExceptionHandler(TwoFactorException.class)
    public ResponseEntity<ApiResponse> handleTwoFactorException(TwoFactorException ex) {
        ApiResponse resp = new ApiResponse("Eroare 2FA: " + ex.getMessage(), false);
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(resp);
    }

    /**
     * Handler pentru JWT expirat (ExpiredJwtException) → 401 UNAUTHORIZED.
     */
    @ExceptionHandler(ExpiredJwtException.class)
    public ResponseEntity<ApiResponse> handleExpiredJwtException(ExpiredJwtException ex) {
        ApiResponse resp = new ApiResponse("Token expirat: " + ex.getMessage(), false);
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(resp);
    }

    /**
     * Handler pentru semnătură invalidă a JWT-ului (SignatureException) → 401 UNAUTHORIZED.
     */
    @ExceptionHandler(SignatureException.class)
    public ResponseEntity<ApiResponse> handleSignatureException(SignatureException ex) {
        ApiResponse resp = new ApiResponse("Semnătură JWT invalidă: " + ex.getMessage(), false);
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(resp);
    }

    /**
     * Handler pentru JWT malformed (MalformedJwtException) → 401 UNAUTHORIZED.
     */
    @ExceptionHandler(MalformedJwtException.class)
    public ResponseEntity<ApiResponse> handleMalformedJwtException(MalformedJwtException ex) {
        ApiResponse resp = new ApiResponse("Format JWT invalid: " + ex.getMessage(), false);
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(resp);
    }

    /**
     * Handler pentru alte excepții JWT (JwtException) → 401 UNAUTHORIZED.
     */
    @ExceptionHandler(JwtException.class)
    public ResponseEntity<ApiResponse> handleJwtException(JwtException ex) {
        ApiResponse resp = new ApiResponse("Eroare JWT: " + ex.getMessage(), false);
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(resp);
    }

    /**
     * În cazul oricărei excepții neașteptate în pachetul specificat,
     * vom returna 500 INTERNAL_SERVER_ERROR cu payload JSON generic.
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse> handleAllOtherExceptions(Exception ex) {
        System.err.println("Unexpected exception caught: " + ex.getMessage());

        ApiResponse resp = new ApiResponse("Eroare internă de server.", false);
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(resp);
    }
}
