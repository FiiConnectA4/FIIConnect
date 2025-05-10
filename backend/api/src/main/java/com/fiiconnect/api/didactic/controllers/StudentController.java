package com.fiiconnect.api.didactic.controllers;

import com.fiiconnect.api.didactic.exceptions.StudentNotFoundException;
import com.fiiconnect.api.didactic.models.Student;
import com.fiiconnect.api.didactic.repositories.StudentRepository;
import com.fiiconnect.api.didactic.services.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class StudentController {
    private final StudentRepository repository;
    private final StudentService service;

    public StudentController(StudentRepository repository, StudentService service)
    {
        this.repository = repository;
        this.service = service;
    }

    @GetMapping("/didactic/student")
    public List<Student> all()
    {
        return repository.findAll();
    }

    @GetMapping("/didactic/student/{id}")
    public Student one(@PathVariable Long id)
    {
        Student student = repository.findById(id).orElseThrow(() -> new StudentNotFoundException(id));
        service.attachEnrollments(student);
        service.attachGrades(student);
        return student;
    }

    @ExceptionHandler(StudentNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String studentNotFound(StudentNotFoundException e) {
        return e.getMessage();
    }
}
