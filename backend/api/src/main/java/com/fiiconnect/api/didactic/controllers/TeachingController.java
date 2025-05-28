package com.fiiconnect.api.didactic.controllers;

import com.fiiconnect.api.didactic.helpers.SQLExceptionMessageParser;
import com.fiiconnect.api.didactic.models.Teaching;
import com.fiiconnect.api.didactic.models.TeachingCompositeKey;
import com.fiiconnect.api.didactic.repositories.TeachingRepository;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;

@RestController
public class TeachingController {
    private final TeachingRepository repository;
    private final SQLExceptionMessageParser exceptionHelper;

    public TeachingController(TeachingRepository repository, SQLExceptionMessageParser exceptionHelper) {
        this.repository = repository;
        this.exceptionHelper = exceptionHelper;
    }

    @PostMapping("/didactic/teach")
    public void addTeaching(@RequestBody Teaching teachingInfo) {
        repository.save(teachingInfo);
    }

    @DeleteMapping("/didactic/teach")
    public void deleteTeaching(@RequestParam Long idProf, @RequestParam Long idCourse) {
        TeachingCompositeKey compKey = new TeachingCompositeKey(idProf, idCourse);
        repository.deleteById(compKey);
    }

    @ResponseStatus(HttpStatus.CONFLICT)
    @ExceptionHandler(ConstraintViolationException.class)
    public String integrityViolation(ConstraintViolationException e) {
        SQLException sqlException = e.getSQLException();
        String message = sqlException.getMessage();
        message = exceptionHelper.getConstraintName(message);
        return "Constraint violated: " + message;
    }
}
