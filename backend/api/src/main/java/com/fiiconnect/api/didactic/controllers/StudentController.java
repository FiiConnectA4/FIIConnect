package com.fiiconnect.api.didactic.controllers;

import com.fiiconnect.api.auth_userMgmt.controllers.PersonController;
import com.fiiconnect.api.auth_userMgmt.dtos.PersonInfoDTO;
import com.fiiconnect.api.didactic.exceptions.StudentNotFoundException;
import com.fiiconnect.api.didactic.exceptions.UnauthorizedOperationException;
import com.fiiconnect.api.didactic.models.Student;
import com.fiiconnect.api.didactic.repositories.StudentRepository;
import com.fiiconnect.api.didactic.services.GradeService;
import com.fiiconnect.api.didactic.services.StudentService;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class StudentController {
    private final StudentRepository repository;
    private final StudentService service;
    private final PersonController personController;
    private final GradeService gradeService;

    public StudentController(StudentRepository repository, StudentService service, PersonController personController, GradeService gradeService)
    {
        this.gradeService = gradeService;
        this.repository = repository;
        this.service = service;
        this.personController = personController;
    }

    @GetMapping("/didactic/student")
    public List<Student> all()
    {
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        List<Student> students = repository.findAll();
        students.forEach(s -> {service.limitVisibility(s, person, false);});
        return students;
    }

    @GetMapping("/didactic/student/{id}")
    public Student one(@PathVariable Long id)
    {
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        Student student = repository.findById(id).orElseThrow(() -> new StudentNotFoundException(id));
        service.limitVisibility(student, person, true);
        return student;
    }

    @GetMapping("/didactic/student/{id}/grades/pdf")
    public ResponseEntity<byte[]> exportStudentGradesPdf(
            @PathVariable Long id,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer semester
    ) {
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();

        Student student = repository.findById(id).orElseThrow(() -> new StudentNotFoundException(id));
        service.limitVisibility(student, person, true);

        byte[] pdfBytes = gradeService.generateStudentGradesPdf(student, year, semester);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDisposition(ContentDisposition.builder("attachment")
                .filename("grades_" + student.getLastName() + "_" + student.getFirstName() + ".pdf")
                .build());
        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }


    @ExceptionHandler(StudentNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String studentNotFound(StudentNotFoundException e) {
        return e.getMessage();
    }
}
