package com.fiiconnect.api.didactic.controllers;

import com.fiiconnect.api.didactic.exceptions.GradeNotFoundException;
import com.fiiconnect.api.didactic.helpers.SQLExceptionMessageParser;
import com.fiiconnect.api.didactic.models.Grade;
import com.fiiconnect.api.didactic.models.GradeCompositeKey;
import com.fiiconnect.api.didactic.repositories.GradeRepository;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.time.Instant;
import java.util.Date;

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

    @PutMapping("/didactic/grade")
    public void modifyGrade(@RequestBody Grade newGrade)
    {
        if(!repository.existsById(newGrade.getId())) throw new GradeNotFoundException(newGrade.getId());
        newGrade.setGradingDate(Date.from(Instant.now()));
        repository.save(newGrade);
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
