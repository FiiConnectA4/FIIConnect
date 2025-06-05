package com.fiiconnect.api.didactic.controllers;

import com.fiiconnect.api.auth_userMgmt.controllers.PersonController;
import com.fiiconnect.api.auth_userMgmt.dtos.BulkNotificationRequest;
import com.fiiconnect.api.auth_userMgmt.dtos.PersonInfoDTO;
import com.fiiconnect.api.auth_userMgmt.models.User;
import com.fiiconnect.api.auth_userMgmt.repositories.UserRepository;
import com.fiiconnect.api.auth_userMgmt.services.NotificationService;
import com.fiiconnect.api.didactic.exceptions.UnauthorizedOperationException;
import com.fiiconnect.api.didactic.helpers.SQLExceptionMessageParser;
import com.fiiconnect.api.didactic.models.CourseMaterial;
import com.fiiconnect.api.didactic.exceptions.CourseMaterialNotFoundException;
import com.fiiconnect.api.didactic.repositories.CourseMaterialRepository;
import com.fiiconnect.api.didactic.repositories.CourseRepository;
import com.fiiconnect.api.didactic.repositories.EnrollmentRepository;
import com.fiiconnect.api.didactic.services.CourseMaterialService;
import com.fiiconnect.api.didactic.services.CourseService;
import com.fiiconnect.api.didactic.services.SftpService;
import lombok.AllArgsConstructor;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URI;
import java.sql.SQLException;
import java.time.Instant;
import java.util.Date;
import java.util.List;
import java.util.Objects;

@AllArgsConstructor
@RestController
public class CourseMaterialController {
    private final SQLExceptionMessageParser exceptionHelper;
    private final CourseMaterialRepository repository;
    private final CourseMaterialService service;
    private final CourseService courseService;
    private final SftpService sftpService;
    private final PersonController personController;
    private final UserRepository userRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final NotificationService notificationService;

    @GetMapping("/didactic/course/material")
    public List<CourseMaterial> all()
    {
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        return repository.findAll().stream().filter(m -> courseService.allowCourseViewing(person, m.getIdCourse())).toList();
    }

    @GetMapping("/didactic/course/material/{id}")
    public CourseMaterial one(@PathVariable Long id)
    {
        CourseMaterial material = repository.findById(id).orElseThrow(() -> new CourseMaterialNotFoundException(id));
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!courseService.allowCourseViewing(person, material.getIdCourse()))
            throw new UnauthorizedOperationException("Only students enrolled in a course or professors who teach the course may see its materials");

        return material;
    }

    @PreAuthorize("hasRole('PROFESOR')")
    @PostMapping("/didactic/course/material")
    public ResponseEntity<?> uploadFile(@RequestParam Long idCourse, @RequestBody MultipartFile file) throws IOException
    {
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!courseService.authorizeCourseOperation(person, idCourse, true))
            throw new UnauthorizedOperationException("Only professors who teach the course may add materials");

        CourseMaterial material = new CourseMaterial();
        material.setIdCourse(idCourse);
        material.setIdProfessor(person.professor().id()); //professor is not null because of preauthorize
        //should get idProf from currently logged-in user, and check for permission
        material.setId(null);
        material.setUploadDate(Date.from(Instant.now()));
        material.setUpdateDate(Date.from(Instant.now()));
        material.setFilename(file.getOriginalFilename());
        repository.save(material);

        try
        {
            sftpService.uploadFile(file, "faculty_files/didactic/course-" + material.getIdCourse() + "/materials/");
        }
        catch (IOException e)
        {
            repository.delete(material);
            throw e;
        }

        List<Long> userIds = enrollmentRepository.findByIdIdCourse(idCourse).stream().map(e -> e.getId().getIdStud()).map(i -> userRepository.findByStudentId(i).orElse(null)).filter(Objects::nonNull).map(User::getId).toList();
        BulkNotificationRequest req = new BulkNotificationRequest();
        req.setRecipientIds(userIds);
        req.setTitle("Course material notification");
        req.setContent("A new material has been added to the course " + courseRepository.findById(idCourse).get().getTitle() + ".");
        req.setType("course");

        notificationService.sendBulk(req);
        return ResponseEntity.created(URI.create("/didactic/course/material/" + material.getId())).build();
    }

    @GetMapping("/didactic/course/material/{id}/file")
    public ResponseEntity<?> downloadFile(@PathVariable Long id) throws IOException {
        CourseMaterial material = repository.findById(id).orElseThrow(()->new CourseMaterialNotFoundException(id));
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!courseService.allowCourseViewing(person, material.getIdCourse()))
            throw new UnauthorizedOperationException("Only students enrolled in a course or professors who teach the course may see its materials");

        File file;
        file = sftpService.downloadFile("faculty_files/didactic/course-" + material.getIdCourse() + "/materials/" + material.getFilename(), "didactic/course-" + material.getIdCourse() + "/materials/" + material.getFilename());

        byte[] data;
        try(var input = new FileInputStream(file))
        {
            data = input.readAllBytes();
        }

        return ResponseEntity.ok().contentType(MediaType.APPLICATION_OCTET_STREAM).header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() +"\"").body(data);
    }

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @DeleteMapping("/didactic/course/material/{id}")
    public void deleteMaterial(@PathVariable Long id) throws IOException {
        CourseMaterial material = repository.findById(id).orElseThrow(() -> new CourseMaterialNotFoundException(id));
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!courseService.authorizeCourseOperation(person, material.getIdCourse(), true))
            throw new UnauthorizedOperationException("Only professors who teach the course may add materials");

        service.deleteMaterial(material);
    }

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @PutMapping("/didactic/course/material/{id}")
    public void changeFilename(@PathVariable Long id, @RequestBody String newFilename) throws IOException {
        CourseMaterial material = repository.findById(id).orElseThrow(() -> new CourseMaterialNotFoundException(id));
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!courseService.authorizeCourseOperation(person, material.getIdCourse(), true))
            throw new UnauthorizedOperationException("Only professors who teach the course may add materials");

        String oldFilename = material.getFilename();
        material.setFilename(newFilename);
        repository.save(material);

        String pathPrefix = "faculty_files/didactic/course-" + material.getIdCourse() + "/materials/";
        sftpService.renameFile(pathPrefix + oldFilename, pathPrefix + newFilename);
    }

    @ResponseStatus(HttpStatus.CONFLICT)
    @ExceptionHandler(ConstraintViolationException.class)
    public String integrityViolation(ConstraintViolationException e)
    {
        SQLException sqlException = e.getSQLException();
        String message = sqlException.getMessage();
        message = exceptionHelper.getConstraintName(message);
        return "Constraint violated: " + message;
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(CourseMaterialNotFoundException.class)
    public String materialNotFound(CourseMaterialNotFoundException e)
    {
        return e.getMessage();
    }
}
