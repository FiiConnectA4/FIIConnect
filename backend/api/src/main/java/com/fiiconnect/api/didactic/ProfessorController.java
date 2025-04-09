package com.fiiconnect.api.didactic;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ProfessorController {
    private final ProfessorRepository repository;

    public ProfessorController(ProfessorRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/didactic/professor")
    List<Professor> all()
    {
        return repository.findAll();
    }

    @GetMapping("/didactic/professor/{id}")
    Professor one(@PathVariable Long id)
    {
        return repository.findById(id).orElseThrow(() -> new ProfessorNotFoundException(id));
    }
}
