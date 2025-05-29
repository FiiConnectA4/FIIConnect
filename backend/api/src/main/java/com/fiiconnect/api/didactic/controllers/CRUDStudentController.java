package com.fiiconnect.api.didactic.controllers;

import com.fiiconnect.api.didactic.exceptions.*;
import com.fiiconnect.api.didactic.models.Enrollment;
import com.fiiconnect.api.didactic.models.EnrollmentCompositeKey;
import com.fiiconnect.api.didactic.models.Student;
import com.fiiconnect.api.didactic.repositories.CourseRepository;
import com.fiiconnect.api.didactic.repositories.EnrollmentRepository;
import com.fiiconnect.api.didactic.repositories.StudentRepository;
import org.springframework.hateoas.EntityModel;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.net.URISyntaxException;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;
import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.methodOn;


@RestController
public class CRUDStudentController {
    private final StudentRepository repository;
    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;


    public CRUDStudentController(StudentRepository repository, EnrollmentRepository enrollmentRepository, CourseRepository courseRepository)
    {
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.repository = repository;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("didactic/enroll/student")
    public ResponseEntity<EntityModel<Student>> create(@RequestBody Student student) throws URISyntaxException {
        if (repository.existsByCnp(student.getCnp())) {
            throw new StudentAlreadyEnrolled(student.getCnp());
        }

        Student savedStudent = repository.save(student);

        EntityModel<Student> studentResource = EntityModel.of(savedStudent,
                linkTo(methodOn(StudentController.class).one(savedStudent.getId()))
                        .withRel("didacticLink")
                        .withTitle("See student details")
                        .withType("GET")
        );

        URI location = new URI("/didactic/student/" + savedStudent.getId());

        return ResponseEntity.created(location).body(studentResource);
    }

    // Example: didactic/enroll?studentId=x&courseId=y$faculty_group=z
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("didactic/enroll")
    public ResponseEntity<Object> updateEnroll(@RequestParam Long studentId, @RequestParam Long courseId, @RequestParam String facultyGroup) {
        if(repository.findById(studentId).isEmpty())
            throw new StudentNotFoundException(studentId);
        if(courseRepository.findById(courseId).isEmpty())
            throw new CourseNotFoundException(courseId);
        var enrollment_key = new EnrollmentCompositeKey(studentId, courseId);
        if(enrollmentRepository.existsById(enrollment_key))
            throw new StudentAlreadyEnrolledInCourse(studentId, courseId);

        var enrollment = new Enrollment(enrollment_key, facultyGroup);
        enrollmentRepository.save(enrollment);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    // Example: didactic/unenroll?studentId=x&courseId=y$faculty_group=z
    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("didactic/unenroll")
    public ResponseEntity<Object> updateUnenroll(@RequestParam Long studentId, @RequestParam Long courseId, @RequestParam String facultyGroup) {
        if(repository.findById(studentId).isEmpty())
            throw new StudentNotFoundException(studentId);
        if(courseRepository.findById(courseId).isEmpty())
            throw new CourseNotFoundException(courseId);
        var enrollment_key = new EnrollmentCompositeKey(studentId, courseId);
        if(!enrollmentRepository.existsById(enrollment_key))
            throw new StudentNotEnrolledInCourse(studentId, courseId);

        var enrollment = new Enrollment(enrollment_key, facultyGroup);
        enrollmentRepository.delete(enrollment);

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    // Will also unenroll student from all of his courses (cascade)
    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("didactic/unenroll/student/{id}")
    public ResponseEntity<EntityModel<Student>> delete(@PathVariable Long id){
        if (!repository.existsById(id)) {
            throw new StudentNotFoundException(id);
        }
        repository.deleteById(id);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

    @ExceptionHandler(StudentAlreadyEnrolled.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String studentAlreadyEnrolled(StudentAlreadyEnrolled e) {
        return e.getMessage();
    }

    @ExceptionHandler(StudentAlreadyEnrolledInCourse.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String studentAlreadyEnrolled(StudentAlreadyEnrolledInCourse e) {
        return e.getMessage();
    }

    @ExceptionHandler(StudentNotEnrolledInCourse.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public String studentAlreadyEnrolled(StudentNotEnrolledInCourse e) {
        return e.getMessage();
    }


}
