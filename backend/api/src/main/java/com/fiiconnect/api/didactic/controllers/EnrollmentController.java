package com.fiiconnect.api.didactic.controllers;

import com.fiiconnect.api.didactic.helpers.SQLExceptionMessageParser;
import com.fiiconnect.api.didactic.models.Enrollment;
import com.fiiconnect.api.didactic.models.EnrollmentCompositeKey;
import com.fiiconnect.api.didactic.repositories.EnrollmentRepository;
import com.fiiconnect.api.didactic.services.EnrollmentService;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;

@RestController
public class EnrollmentController {
    private final EnrollmentRepository repository;
    private final EnrollmentService service;
    private final SQLExceptionMessageParser exceptionHelper;

    public EnrollmentController(EnrollmentRepository repository, EnrollmentService service, SQLExceptionMessageParser exceptionHelper) {
        this.repository = repository;
        this.service = service;
        this.exceptionHelper = exceptionHelper;
    }

    @PostMapping("/didactic/enroll")
    public void addEnrollment(@RequestBody Enrollment enrollment)
    {
        repository.save(enrollment);
    }

    @DeleteMapping("/didactic/enroll")
    public void deleteEnrollment(@RequestParam Long idStud, @RequestParam Long idCourse)
    {
        EnrollmentCompositeKey compKey = new EnrollmentCompositeKey(idStud, idCourse);
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
