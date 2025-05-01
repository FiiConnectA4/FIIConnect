package com.fiiconnect.api.didactic.controllers;

import com.fiiconnect.api.didactic.helpers.SQLExceptionMessageParser;
import com.fiiconnect.api.didactic.models.CourseMaterial;
import com.fiiconnect.api.didactic.exceptions.CourseMaterialNotFoundException;
import com.fiiconnect.api.didactic.repositories.CourseMaterialRepository;
import com.fiiconnect.api.didactic.services.CourseMaterialService;
import com.fiiconnect.api.didactic.services.SftpService;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URI;
import java.sql.SQLException;
import java.time.Instant;
import java.util.Date;
import java.util.List;

@RestController
public class CourseMaterialController {
    private final SQLExceptionMessageParser exceptionHelper;
    private final CourseMaterialRepository repository;
    private final CourseMaterialService service;
    private final SftpService sftpService;

    public CourseMaterialController(SQLExceptionMessageParser exceptionHelper, CourseMaterialRepository repository, CourseMaterialService service, SftpService sftpService) {
        this.exceptionHelper = exceptionHelper;
        this.repository = repository;
        this.service = service;
        this.sftpService = sftpService;
    }

    @GetMapping("/didactic/course/material")
    public List<CourseMaterial> all()
    {
        return repository.findAll();
    }

    @GetMapping("/didactic/course/material/{id}")
    public CourseMaterial one(@PathVariable Long id)
    {
        return repository.findById(id).orElseThrow(() -> new CourseMaterialNotFoundException(id));
    }

    @PostMapping("/didactic/course/material")
    public ResponseEntity<?> addMaterial(@RequestBody CourseMaterial material)
    {
        //should get idProf from currently logged-in user, and check for permission
        material.setId(null);
        material.setUploadDate(Date.from(Instant.now()));
        material.setUpdateDate(Date.from(Instant.now()));

        material = repository.save(material);
        return ResponseEntity.created(URI.create("/didactic/course/material/" + material.getId())).build();
    }

    @PostMapping("/didactic/course/material/{id}/file")
    public void uploadFile(@PathVariable Long id, @RequestBody MultipartFile file) throws IOException
    {
        CourseMaterial material = repository.findById(id).orElseThrow(()->new CourseMaterialNotFoundException(id));
        material.setFilename(file.getOriginalFilename());
        sftpService.uploadFile(file, "faculty_files/didactic/course-" + material.getIdCourse() + "/materials/");
        repository.save(material);
    }

    @GetMapping("/didactic/course/material/{id}/file")
    public ResponseEntity<?> downloadFile(@PathVariable Long id) throws IOException {
        CourseMaterial material = repository.findById(id).orElseThrow(()->new CourseMaterialNotFoundException(id));
        File file;
        file = sftpService.downloadFile("faculty_files/didactic/course-" + material.getIdCourse() + "/materials/" + material.getFilename(), "didactic/course-" + material.getIdCourse() + "/materials/" + material.getFilename());

        byte[] data;
        try(var input = new FileInputStream(file))
        {
            data = input.readAllBytes();
        }

        return ResponseEntity.ok().contentType(MediaType.APPLICATION_OCTET_STREAM).header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getName() +"\"").body(data);
    }

    @DeleteMapping("/didactic/course/material/{id}")
    public void deleteMaterial(@PathVariable Long id) throws IOException {
        CourseMaterial material = repository.findById(id).orElseThrow(() -> new CourseMaterialNotFoundException(id));
        service.deleteMaterial(material);
    }

    @PutMapping("/didactic/course/material/{id}")
    public void changeFilename(@PathVariable Long id, @RequestBody String newFilename) throws IOException {
        CourseMaterial material = repository.findById(id).orElseThrow(() -> new CourseMaterialNotFoundException(id));

        String pathPrefix = "faculty_files/didactic/course-" + material.getIdCourse() + "/materials/";
        sftpService.renameFile(pathPrefix + material.getFilename(), pathPrefix + newFilename);

        material.setFilename(newFilename);
        repository.save(material);
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
