package com.fiiconnect.api.didactic.controllers;


import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import com.fiiconnect.api.didactic.exceptions.CourseNotFoundException;
import com.fiiconnect.api.didactic.exceptions.IconNotFoundException;
import com.fiiconnect.api.didactic.helpers.SQLExceptionMessageParser;
import com.fiiconnect.api.didactic.models.Course;
import com.fiiconnect.api.didactic.models.CourseMaterial;
import com.fiiconnect.api.didactic.models.CourseModelAssembler;
import com.fiiconnect.api.didactic.models.Enrollment;
import com.fiiconnect.api.didactic.repositories.CourseRepository;
import com.fiiconnect.api.didactic.services.CourseMaterialService;
import com.fiiconnect.api.didactic.services.CourseService;
import com.fiiconnect.api.didactic.services.EnrollmentService;
import com.fiiconnect.api.didactic.services.SftpService;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.core.io.InputStreamResource;
import org.springframework.hateoas.EntityModel;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class CourseController {
    private final CourseRepository repository;
    private final CourseModelAssembler assembler;
    private final CourseService service;
    private final SQLExceptionMessageParser exceptionHelper;
    private final EnrollmentService enrollmentService;
    private final CourseMaterialService materialService;
    private final SftpService sftpService;

    public CourseController(CourseRepository repository, CourseModelAssembler assembler, CourseService service, SQLExceptionMessageParser exceptionHelper, EnrollmentService enrollmentService, CourseMaterialService materialService, SftpService sftpService) {
        this.repository = repository;
        this.assembler = assembler;
        this.service = service;
        this.exceptionHelper = exceptionHelper;
        this.enrollmentService = enrollmentService;
        this.materialService = materialService;
        this.sftpService = sftpService;
    }

    // get all courses
    @GetMapping("/didactic/course")
     public CollectionModel<EntityModel<Course>> all() {
        List<Course> courseList = repository.findAll();
        courseList.forEach(service::attachIcon);
        List<EntityModel<Course>> courses = courseList.stream().map(assembler::toModel).collect(Collectors.toList());
        return CollectionModel.of(courses, linkTo(methodOn(CourseController.class).all()).withSelfRel());
    }

    @GetMapping("didactic/courses/{year}/{semester}")
    public CollectionModel<EntityModel<Course>> allCourse(@PathVariable("year") Integer year, @PathVariable("semester") Integer semester) {
        List<Course> courseList = service.viewAllCoursesAvailable(year, semester);
        courseList.forEach((c) -> {c.setMaterials(null); service.attachIcon(c);});
        List<EntityModel<Course>>  courses = courseList.stream().map(assembler::toModel).toList();
        return CollectionModel.of(courses, linkTo(methodOn(CourseController.class).all()).withSelfRel());
    }

    @GetMapping("didactic/course/{id}")
    public EntityModel<Course> one(@PathVariable("id") Long id){
        Course course = repository.findById(id).orElseThrow(() -> new CourseNotFoundException(id));
        service.attachProfessors(course);
        service.attachMaterials(course);
        service.attachDescription(course);
        service.attachIcon(course);
        return assembler.toModel(course);
    }

    @GetMapping("/didactic/course/{id}/enrolled")
    public List<Enrollment> getEnrolledStudents(@PathVariable Long id)
    {
        return enrollmentService.getCourseEnrollments(id);
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
                    course.setArchived(newCourse.getArchived());
                    service.attachIcon(course);
                    return repository.save(course);
                }).orElseGet(() -> repository.save(newCourse));
        EntityModel<Course> entityModel = assembler.toModel(temp);
        return ResponseEntity.created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri()).body(entityModel);
    }

    @DeleteMapping("/didactic/course/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable("id") Long id) throws CourseNotFoundException, IOException {
        Course course = repository.findById(id).orElseThrow(() -> new CourseNotFoundException(id));
        service.attachMaterials(course);

        for(CourseMaterial material : course.getMaterials())
            materialService.deleteMaterial(material);

        String pathPrefix = "faculty_files/didactic/course-" + course.getId() + "/";
        if(sftpService.checkExists(pathPrefix))
        {
            try{
                sftpService.deleteFile(pathPrefix + "materials/", true);
            }catch(FileNotFoundException e)
            {
                //do nothing
            }
            try{
                sftpService.deleteFile(pathPrefix + "description.txt", false);
            }catch(FileNotFoundException e)
            {
                //do nothing
            }
            try{
                sftpService.deleteFile(pathPrefix + "icon.png", false);
            }catch(FileNotFoundException e)
            {
                //do nothing
            }

            sftpService.deleteFile(pathPrefix, true);
        }

        repository.delete(course);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/didactic/course/{id}/description")
    public void addDescription(@PathVariable Long id, @RequestBody String description)
    {
        service.saveDescription(id, description);
    }

    @GetMapping("/didactic/course/{id}/icon.png")
    public ResponseEntity<?> getIcon(@PathVariable Long id) {
        try {
            File iconFile = sftpService.downloadFile("/faculty_files/didactic/course-" + id + "/icon.png");
            InputStreamResource resource = new InputStreamResource(new FileInputStream(iconFile));

            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG)
                    .body(resource);
        } catch (IOException e) {
            if (e instanceof FileNotFoundException) {
                String defaultIconUrl = "/didactic/course/default_course_icon.png";
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Icon not found. Use default icon: " + defaultIconUrl);
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error retrieving icon.");
        }
    }
    @GetMapping("/didactic/course/default_course_icon.png")
    public ResponseEntity<?> getDefaultIcon() {
        try {
            File iconFile = sftpService.downloadFile("/faculty_files/didactic/default_course_icon.png");
            InputStreamResource resource = new InputStreamResource(new FileInputStream(iconFile));

            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG)
                    .body(resource);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving default course icon.");
        }
    }
    @PutMapping("/didactic/course/{id}/archive")
    public void archiveCourse(@PathVariable Long id)
    {
        Course course = repository.findById(id).orElseThrow(() -> new CourseNotFoundException(id));
        course.setArchived(1);
        repository.save(course);
    }
    @PutMapping("/didactic/course/{id}/desarchive")
    public void desarchiveCourse(@PathVariable Long id)
    {
        Course course = repository.findById(id).orElseThrow(() -> new CourseNotFoundException(id));
        course.setArchived(0);
        repository.save(course);
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
}
