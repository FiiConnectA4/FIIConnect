package com.fiiconnect.api.didactic;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class ProfessorController {
    private final ProfessorRepository repository;
    private final ProfessorService service;
    private final TeachingRepository teachingRepo;
    private final TeachingService teachingService;

    public ProfessorController(ProfessorRepository repository, ProfessorService service, TeachingRepository teachingRepo, TeachingService teachingService) {
        this.repository = repository;
        this.service = service;
        this.teachingRepo = teachingRepo;
        this.teachingService = teachingService;
    }

    @GetMapping("/didactic/professor")
    List<Professor> all()
    {
        return repository.findAll();
    }

    @GetMapping("/didactic/professor/{id}")
    Professor one(@PathVariable Long id)
    {
        Professor professor = repository.findById(id).orElseThrow(() -> new ProfessorNotFoundException(id));

        service.attachCourses(professor);
        return professor;
    }
}
