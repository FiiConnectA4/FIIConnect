package com.fiiconnect.api.didactic;

import org.hibernate.PropertyValueException;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.time.Instant;
import java.util.Date;
import java.util.List;

@RestController
public class CourseMaterialController {
    private final CourseMaterialRepository repository;

    public CourseMaterialController(CourseMaterialRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/didactic/course/material")
    List<CourseMaterial> all()
    {
        return repository.findAll();
    }

    @GetMapping("/didactic/course/material/{id}")
    CourseMaterial one(@PathVariable Long id)
    {
        return repository.findById(id).orElseThrow(() -> new CourseMaterialNotFoundException(id));
    }

    @PostMapping("/didactic/course/material")
    ResponseEntity<?> uploadMaterial(@RequestBody CourseMaterial material)
    {
        //should get idProf from currently logged-in user, and check for permission
        material.setId(null);
        material.setUploadDate(Date.from(Instant.now()));
        material.setUpdateDate(Date.from(Instant.now()));

        material = repository.save(material);
        return ResponseEntity.created(URI.create("/didactic/course/material/" + material.getId())).build();
    }

    @DeleteMapping("/didactic/course/material/{id}")
    void deleteMaterial(@PathVariable Long id)
    {
        repository.deleteById(id);
    }

    @ResponseStatus(HttpStatus.CONFLICT)
    @ExceptionHandler(ConstraintViolationException.class)
    public String integrityViolation(ConstraintViolationException e)
    {
        String message = e.getMessage();
        if(message.contains("unique constraint"))
            return "Unique constraint violated " + e.getConstraintName();
        else if(message.contains("parent key not found"))
            return "Parent key not found " + e.getConstraintName();
        else
            return "Unknown kind of constraint violation";
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(CourseMaterialNotFoundException.class)
    public String materialNotFound(CourseMaterialNotFoundException e)
    {
        return e.getMessage();
    }
}
