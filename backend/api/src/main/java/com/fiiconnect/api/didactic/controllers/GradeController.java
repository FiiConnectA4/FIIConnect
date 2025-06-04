package com.fiiconnect.api.didactic.controllers;

import com.fiiconnect.api.auth_userMgmt.controllers.PersonController;
import com.fiiconnect.api.auth_userMgmt.dtos.PersonInfoDTO;
import com.fiiconnect.api.didactic.exceptions.GradeNotFoundException;
import com.fiiconnect.api.didactic.exceptions.UnauthorizedOperationException;
import com.fiiconnect.api.didactic.helpers.SQLExceptionMessageParser;
import com.fiiconnect.api.didactic.models.Grade;
import com.fiiconnect.api.didactic.models.StudCourseCompositeKey;
import com.fiiconnect.api.didactic.repositories.GradeRepository;
import com.fiiconnect.api.didactic.services.CourseService;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.time.Instant;
import java.util.Date;

@RestController
public class GradeController {
    private final GradeRepository repository;
    private final SQLExceptionMessageParser exceptionHelper;
    private final PersonController personController;
    private final CourseService courseService;

    public GradeController(GradeRepository repository, SQLExceptionMessageParser exceptionHelper, PersonController personController, CourseService courseService) {
        this.repository = repository;
        this.exceptionHelper = exceptionHelper;
        this.personController = personController;
        this.courseService = courseService;
    }

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @PostMapping("/didactic/grade")
    public void addGrade(@RequestBody Grade gradeInfo)
    {
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!courseService.authorizeCourseOperation(person, gradeInfo.getId().getIdCourse(), false))
            throw new UnauthorizedOperationException("Only course professors may add grades to courses");
        //////////////////////////////////////////

        repository.save(gradeInfo);
    }

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @DeleteMapping("/didactic/grade")
    public void deleteGrade(@RequestParam Long idStud, @RequestParam Long idCourse)
    {
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!courseService.authorizeCourseOperation(person, idCourse, false))
            throw new UnauthorizedOperationException("Only course professors may delete grades from courses");
        //////////////////////////////////////////

        StudCourseCompositeKey compKey = new StudCourseCompositeKey(idStud, idCourse);
        repository.deleteById(compKey);
    }

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @PutMapping("/didactic/grade")
    public void modifyGrade(@RequestBody Grade newGrade)
    {
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!courseService.authorizeCourseOperation(person, newGrade.getId().getIdCourse(), false))
            throw new UnauthorizedOperationException("Only course professors may modify grades from courses");
        //////////////////////////////////////////

        if(!repository.existsById(newGrade.getId())) throw new GradeNotFoundException(newGrade.getId());
        newGrade.setGradingDate(Date.from(Instant.now()));
        repository.save(newGrade);
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
