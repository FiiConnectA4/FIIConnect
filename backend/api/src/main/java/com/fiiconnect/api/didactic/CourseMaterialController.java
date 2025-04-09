package com.fiiconnect.api.didactic;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

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
}
