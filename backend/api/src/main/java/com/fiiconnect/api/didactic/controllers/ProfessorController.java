package com.fiiconnect.api.didactic.controllers;

import com.fiiconnect.api.auth_userMgmt.controllers.PersonController;
import com.fiiconnect.api.auth_userMgmt.dtos.PersonInfoDTO;
import com.fiiconnect.api.didactic.exceptions.ProfessorAlreadyEnrolled;
import com.fiiconnect.api.didactic.exceptions.ProfessorNotFoundException;

import com.fiiconnect.api.didactic.models.Professor;

import com.fiiconnect.api.didactic.repositories.ProfessorRepository;
import com.fiiconnect.api.didactic.services.ProfessorService;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;

@RestController
public class ProfessorController {
    private final ProfessorRepository repository;
    private final ProfessorService service;
    private final PersonController personController;

    public ProfessorController(ProfessorRepository repository, ProfessorService service, PersonController personController) {
        this.repository = repository;
        this.service = service;
        this.personController = personController;
    }

    @GetMapping("/didactic/professor")
    public List<Professor> all() {
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        List<Professor> students = repository.findAll();
        students.forEach(p -> {service.limitVisibility(p, person, false);});
        return students;
    }

    @GetMapping("/didactic/professor/{id}")
    public Professor one(@PathVariable Long id) {
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        Professor professor = repository.findById(id).orElseThrow(() -> new ProfessorNotFoundException(id));
        service.limitVisibility(professor, person, true);
        return professor;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("didactic/enroll/professor")
    public ResponseEntity<EntityModel<Professor>> create(@RequestBody Professor professor) throws URISyntaxException {
        if (repository.existsByCnp(professor.getCnp())) {
            throw new ProfessorAlreadyEnrolled(professor.getCnp());
        }

        Professor savedProfessor = repository.save(professor);

        EntityModel<Professor> studentResource = EntityModel.of(savedProfessor,
                linkTo(methodOn(ProfessorController.class).one(savedProfessor.getId()))
                        .withRel("didacticLink")
                        .withTitle("See professor details")
                        .withType("GET")
        );

        URI location = new URI("/didactic/professor/" + savedProfessor.getId());

        return ResponseEntity.created(location).body(studentResource);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("didactic/unenroll/professor/{id}")
    public ResponseEntity<EntityModel<Professor>> delete(@PathVariable Long id) {
        if (!repository.existsById(id)) {
            throw new ProfessorNotFoundException(id);
        }
        repository.deleteById(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @ExceptionHandler(ProfessorAlreadyEnrolled.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String professorAlreadyEnrolled(ProfessorAlreadyEnrolled e) {
        return e.getMessage();
    }

    @ExceptionHandler(ProfessorNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String professorNotFound(ProfessorNotFoundException e) {
        return e.getMessage();
    }
}
