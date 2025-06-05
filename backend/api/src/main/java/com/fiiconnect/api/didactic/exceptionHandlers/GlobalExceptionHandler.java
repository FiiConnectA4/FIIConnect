package com.fiiconnect.api.didactic.exceptionHandlers;

import com.fiiconnect.api.didactic.exceptions.InvalidArgumentsException;
import com.fiiconnect.api.didactic.exceptions.TextExceedingException;
import com.fiiconnect.api.didactic.exceptions.TransferRequestAlreadyRegisteredException;
import com.fiiconnect.api.didactic.exceptions.TransferRequestNotFound;
import com.fiiconnect.api.didactic.models.StudCourseCompositeKey;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidArgumentsException.class)
    public ResponseEntity<Object> handleInvalidArguments(InvalidArgumentsException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(TextExceedingException.class)
    public ResponseEntity<Object> handleTextExceeding(TextExceedingException ex) {
        return buildResponse(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(TransferRequestAlreadyRegisteredException.class)
    public ResponseEntity<Object> handleAlreadyExists(TransferRequestAlreadyRegisteredException ex) {
        return buildResponse(HttpStatus.CONFLICT, ex.getMessage());
    }

    @ExceptionHandler(TransferRequestNotFound.class)
    public ResponseEntity<Object> handleNotFound(TransferRequestNotFound ex) {
        return buildResponse(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    private ResponseEntity<Object> buildResponse(HttpStatus status, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("status", status.value());
        body.put("error", status.getReasonPhrase());
        body.put("message", message);
        return new ResponseEntity<>(body, status);
    }
}
