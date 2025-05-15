package com.fiiconnect.api.didactic.controllers;

import com.fiiconnect.api.didactic.helpers.SQLExceptionMessageParser;
import com.fiiconnect.api.didactic.models.Grade;
import com.fiiconnect.api.didactic.models.GradeCompositeKey;
import com.fiiconnect.api.didactic.repositories.GradeRepository;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;

@RestController
public class GradeController {
    private final GradeRepository repository;
    private final SQLExceptionMessageParser exceptionHelper;

    public GradeController(GradeRepository repository, SQLExceptionMessageParser exceptionHelper) {
        this.repository = repository;
        this.exceptionHelper = exceptionHelper;
    }

    @PostMapping("/didactic/grade")
    public void addGrade(@RequestBody Grade gradeInfo)
    {
        repository.save(gradeInfo);
    }

    @DeleteMapping("/didactic/grade")
    public void deleteGrade(@RequestParam Long idStud, @RequestParam Long idCourse)
    {
        GradeCompositeKey compKey = new GradeCompositeKey(idStud, idCourse);
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
