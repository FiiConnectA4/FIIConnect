package com.fiiconnect.api.didactic.controllers;

import com.fiiconnect.api.didactic.models.Enrollment;
import com.fiiconnect.api.didactic.models.EnrollmentCompositeKey;
import com.fiiconnect.api.didactic.repositories.EnrollmentRepository;
import com.fiiconnect.api.didactic.services.EnrollmentService;
import org.springframework.web.bind.annotation.*;

@RestController
public class EnrollmentController {
    private final EnrollmentRepository repository;
    private final EnrollmentService service;

    public EnrollmentController(EnrollmentRepository repository, EnrollmentService service) {
        this.repository = repository;
        this.service = service;
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
}
