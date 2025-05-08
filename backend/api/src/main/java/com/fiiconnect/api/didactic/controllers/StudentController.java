package com.fiiconnect.api.didactic.controllers;

import com.fiiconnect.api.didactic.exceptions.StudentNotFoundException;
import com.fiiconnect.api.didactic.models.Grade;
import com.fiiconnect.api.didactic.models.Student;
import com.fiiconnect.api.didactic.repositories.StudentRepository;
import com.fiiconnect.api.didactic.services.StudentService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Set;

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
}
