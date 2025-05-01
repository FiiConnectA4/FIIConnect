package com.fiiconnect.api.didactic.controllers;

import com.fiiconnect.api.didactic.models.Teaching;
import com.fiiconnect.api.didactic.models.TeachingCompositeKey;
import com.fiiconnect.api.didactic.repositories.TeachingRepository;
import com.fiiconnect.api.didactic.services.TeachingService;
import org.springframework.web.bind.annotation.*;

@RestController
public class TeachingController {
    private final TeachingRepository repository;
    private final TeachingService service;

    public TeachingController(TeachingRepository repository, TeachingService service) {
        this.repository = repository;
        this.service = service;
    }

    @PostMapping("/didactic/teach")
    public void addTeaching(@RequestBody Teaching teachingInfo)
    {
        repository.save(teachingInfo);
    }

    @DeleteMapping("/didactic/teach")
    public void deleteTeaching(@RequestParam Long idProf, @RequestParam Long idCourse)
    {
        TeachingCompositeKey compKey = new TeachingCompositeKey(idProf, idCourse);
        repository.deleteById(compKey);
    }
}
