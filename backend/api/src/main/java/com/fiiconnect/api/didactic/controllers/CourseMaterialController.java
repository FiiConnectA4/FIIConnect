package com.fiiconnect.api.didactic.controllers;

import com.fiiconnect.api.didactic.helpers.SQLExceptionMessageParser;
import com.fiiconnect.api.didactic.models.CourseMaterial;
import com.fiiconnect.api.didactic.exceptions.CourseMaterialNotFoundException;
import com.fiiconnect.api.didactic.repositories.CourseMaterialRepository;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.sql.SQLException;
import java.time.Instant;
import java.util.Date;
import java.util.List;

@RestController
public class CourseMaterialController {
    private final SQLExceptionMessageParser exceptionHelper;
    private final CourseMaterialRepository repository;

    public CourseMaterialController(SQLExceptionMessageParser exceptionHelper, CourseMaterialRepository repository) {
        this.exceptionHelper = exceptionHelper;
        this.repository = repository;
    }

    @GetMapping("/didactic/course/material")
    public List<CourseMaterial> all()
    {
        return repository.findAll();
    }

    @GetMapping("/didactic/course/material/{id}")
    public CourseMaterial one(@PathVariable Long id)
    {
        return repository.findById(id).orElseThrow(() -> new CourseMaterialNotFoundException(id));
    }

    @PostMapping("/didactic/course/material")
    public ResponseEntity<?> uploadMaterial(@RequestBody CourseMaterial material)
    {
        //should get idProf from currently logged-in user, and check for permission
        material.setId(null);
        material.setUploadDate(Date.from(Instant.now()));
        material.setUpdateDate(Date.from(Instant.now()));

        material = repository.save(material);
        return ResponseEntity.created(URI.create("/didactic/course/material/" + material.getId())).build();
    }

    @DeleteMapping("/didactic/course/material/{id}")
    public void deleteMaterial(@PathVariable Long id)
    {
        repository.deleteById(id);
    }

    @ResponseStatus(HttpStatus.CONFLICT)
    @ExceptionHandler(ConstraintViolationException.class)
    public String integrityViolation(ConstraintViolationException e)
    {
        SQLException sqlException = e.getSQLException();
        String message = sqlException.getMessage();
        message = exceptionHelper.getConstraintName(message);
        return "Constraint violated: " + message;
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(CourseMaterialNotFoundException.class)
    public String materialNotFound(CourseMaterialNotFoundException e)
    {
        return e.getMessage();
    }
}
