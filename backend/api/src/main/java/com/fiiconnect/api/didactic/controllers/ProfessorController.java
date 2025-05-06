package com.fiiconnect.api.didactic.controllers;

import com.fiiconnect.api.didactic.exceptions.ProfessorNotFoundException;
import com.fiiconnect.api.didactic.models.Professor;
import com.fiiconnect.api.didactic.repositories.ProfessorRepository;
import com.fiiconnect.api.didactic.services.ProfessorService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ProfessorController {
    private final ProfessorRepository repository;
    private final ProfessorService service;

    public ProfessorController(ProfessorRepository repository, ProfessorService service) {
        this.repository = repository;
        this.service = service;
    }

    @GetMapping("/didactic/professor")
    public List<Professor> all()
    {
        return repository.findAll();
    }

    @GetMapping("/didactic/professor/{id}")
    public Professor one(@PathVariable Long id)
    {
        Professor professor = repository.findById(id).orElseThrow(() -> new ProfessorNotFoundException(id));

        service.attachCourses(professor);
        return professor;
    }
}
