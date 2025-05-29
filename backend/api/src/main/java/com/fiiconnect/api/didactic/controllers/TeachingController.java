package com.fiiconnect.api.didactic.controllers;

import com.fiiconnect.api.auth_userMgmt.controllers.PersonController;
import com.fiiconnect.api.auth_userMgmt.dtos.PersonInfoDTO;
import com.fiiconnect.api.didactic.exceptions.UnauthorizedOperationException;
import com.fiiconnect.api.didactic.helpers.SQLExceptionMessageParser;
import com.fiiconnect.api.didactic.models.Teaching;
import com.fiiconnect.api.didactic.models.TeachingCompositeKey;
import com.fiiconnect.api.didactic.repositories.TeachingRepository;
import com.fiiconnect.api.didactic.services.CourseService;
import com.fiiconnect.api.didactic.services.TeachingService;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.List;

@RestController
public class TeachingController {
    private final TeachingRepository repository;
    private final TeachingService service;
    private final CourseService courseService;
    private final SQLExceptionMessageParser exceptionHelper;
    private final PersonController personController;

    public TeachingController(TeachingRepository repository, TeachingService service, CourseService courseService, SQLExceptionMessageParser exceptionHelper, PersonController personController) {
        this.repository = repository;
        this.service = service;
        this.courseService = courseService;
        this.exceptionHelper = exceptionHelper;
        this.personController = personController;
    }

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @PostMapping("/didactic/teach")
    public void addTeaching(@RequestBody Teaching teachingInfo) {
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!courseService.authorizeCourseOperation(person, teachingInfo.getId().getIdCourse(), true))
            throw new UnauthorizedOperationException("Only course holders may add teaching information to courses");

        //////////////////////////////////////////
        service.addTeaching(teachingInfo);
    }

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @DeleteMapping("/didactic/teach")
    public void deleteTeaching(@RequestParam Long idProf, @RequestParam Long idCourse) {
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!courseService.authorizeCourseOperation(person, idCourse, true))
            throw new UnauthorizedOperationException("Only course holders may remove teaching information from courses");
        //////////////////////////////////////////
        TeachingCompositeKey compKey = new TeachingCompositeKey(idProf, idCourse);
        repository.deleteById(compKey);
    }

    @ResponseStatus(HttpStatus.CONFLICT)
    @ExceptionHandler(ConstraintViolationException.class)
    public String integrityViolation(ConstraintViolationException e) {
        SQLException sqlException = e.getSQLException();
        String message = sqlException.getMessage();
        message = exceptionHelper.getConstraintName(message);
        return "Constraint violated: " + message;
    }
}
