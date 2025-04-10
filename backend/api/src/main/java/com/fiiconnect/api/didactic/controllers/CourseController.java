package com.fiiconnect.api.didactic.controllers;


import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import com.fiiconnect.api.didactic.exceptions.CourseNotFoundException;
import com.fiiconnect.api.didactic.models.Course;
import com.fiiconnect.api.didactic.models.CourseModelAssembler;
import com.fiiconnect.api.didactic.repositories.CourseRepository;
import com.fiiconnect.api.didactic.repositories.TeachingRepository;
import com.fiiconnect.api.didactic.services.CourseService;
import com.fiiconnect.api.didactic.services.TeachingService;
import org.springframework.hateoas.EntityModel;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class CourseController {
    private final CourseRepository repository;
    private final CourseModelAssembler assembler;
    private final CourseService service;

    public CourseController(CourseRepository repository, CourseModelAssembler assembler, CourseService service) {
        this.repository = repository;
        this.assembler = assembler;
        this.service = service;
    }

    // get all courses
    @GetMapping("/didactic/course")
     public CollectionModel<EntityModel<Course>> all() {
        List<Course> courseList = repository.findAll();
        List<EntityModel<Course>> courses = courseList.stream().map(assembler::toModel).collect(Collectors.toList());
        return CollectionModel.of(courses, linkTo(methodOn(CourseController.class).all()).withSelfRel());
    }

    @GetMapping("didactic/courses/{year}/{semester}")
    public CollectionModel<EntityModel<Course>> allCourse(@PathVariable("year") Integer year, @PathVariable("semester") Integer semester) {
        List<Course> courseList = service.viewAllCoursesAvailable(year, semester);
        courseList.forEach((c) -> {c.setMaterials(null);});
        List<EntityModel<Course>>  courses = courseList.stream().map(assembler::toModel).toList();
        return CollectionModel.of(courses, linkTo(methodOn(CourseController.class).all()).withSelfRel());
    }

    @GetMapping("didactic/course/{id}")
    public EntityModel<Course> one(@PathVariable("id") Long id){
        Course course = repository.findById(id).orElseThrow(() -> new CourseNotFoundException(id));
        service.attachProfessors(course);
        service.attachMaterials(course);
        return assembler.toModel(course);
    }

    @PostMapping("/didactic/course")
    public ResponseEntity<?> newCourse(@RequestBody Course newCourse) {
        newCourse.setId(null); // enforcing to choose a random id the db should create a sequence for id generation
        EntityModel<Course> entityModel = assembler.toModel(repository.save(newCourse));
        return ResponseEntity.created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri()).build();
    }

    @PutMapping("/didactic/course/{id}")
    public ResponseEntity<?> replaceCourse(@PathVariable("id") Long id, @RequestBody Course newCourse) {
        Course temp = repository.findById(id)
                .map(course -> {
                    course.setArchived(newCourse.getArchived());
                    course.setCode(newCourse.getCode());
                    course.setCredits(newCourse.getCredits());
                    course.setYear(newCourse.getYear());
                    course.setSemester(newCourse.getSemester());
                    course.setTitle(newCourse.getTitle());
                    return repository.save(course);
                }).orElseGet(() -> repository.save(newCourse));
        EntityModel<Course> entityModel = assembler.toModel(temp);
        return ResponseEntity.created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri()).body(entityModel);
    }

    @DeleteMapping("/didactic/course/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable("id") Long id) throws CourseNotFoundException {
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
