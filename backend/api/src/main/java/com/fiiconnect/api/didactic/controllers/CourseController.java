package com.fiiconnect.api.didactic.controllers;


import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

import com.fiiconnect.api.auth_userMgmt.controllers.PersonController;
import com.fiiconnect.api.auth_userMgmt.dtos.PersonInfoDTO;
import com.fiiconnect.api.didactic.exceptions.CourseNotFoundException;
import com.fiiconnect.api.didactic.exceptions.UnauthorizedOperationException;
import com.fiiconnect.api.didactic.helpers.SQLExceptionMessageParser;
import com.fiiconnect.api.didactic.models.*;
import com.fiiconnect.api.didactic.repositories.CourseRepository;
import com.fiiconnect.api.didactic.services.*;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.core.io.InputStreamResource;
import org.springframework.hateoas.EntityModel;

import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    private final GradeService gradeService;
    private final SftpService sftpService;
    private final PersonController personController;
    private final TeachingService teachingService;

    public CourseController(CourseRepository repository, CourseModelAssembler assembler, CourseService service, SQLExceptionMessageParser exceptionHelper, EnrollmentService enrollmentService, CourseMaterialService materialService, GradeService gradeService, SftpService sftpService, PersonController personController, TeachingService teachingService) {
        this.repository = repository;
        this.assembler = assembler;
        this.service = service;
        this.exceptionHelper = exceptionHelper;
        this.enrollmentService = enrollmentService;
        this.materialService = materialService;
        this.gradeService = gradeService;
        this.sftpService = sftpService;
        this.personController = personController;
        this.teachingService = teachingService;
    }

    // get all courses
    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @GetMapping("/didactic/course")
     public CollectionModel<EntityModel<Course>> all() {
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        List<Course> courseList = repository.findAll().stream().filter(c -> service.allowCourseViewing(person, c.getId())).toList();

        courseList.forEach(service::attachIcon);
        List<EntityModel<Course>> courses = courseList.stream().map(assembler::toModel).collect(Collectors.toList());
        return CollectionModel.of(courses, linkTo(methodOn(CourseController.class).all()).withSelfRel());
    }

    @GetMapping("didactic/courses/{year}/{semester}")
    public CollectionModel<EntityModel<Course>> allCourse(@PathVariable("year") Integer year, @PathVariable("semester") Integer semester) {
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        List<Course> courseList = service.viewAllCoursesAvailable(year, semester).stream().filter(c -> service.allowCourseViewing(person, c.getId())).toList();

        courseList.forEach((c) -> {c.setMaterials(null); service.attachIcon(c);});
        List<EntityModel<Course>>  courses = courseList.stream().map(assembler::toModel).toList();
        return CollectionModel.of(courses, linkTo(methodOn(CourseController.class).all()).withSelfRel());
    }

    @GetMapping("didactic/course/{id}")
    public EntityModel<Course> one(@PathVariable("id") Long id){
        Course course = repository.findById(id).orElseThrow(() -> new CourseNotFoundException(id));
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!service.allowCourseViewing(person, id))
            throw new UnauthorizedOperationException("Only students enrolled in a course or professors who teach the course may see it");

        service.attachProfessors(course);
        service.attachMaterials(course);
        service.attachDescription(course);
        service.attachIcon(course);
        return assembler.toModel(course);
    }

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @GetMapping("/didactic/course/{id}/enrolled")
    public List<Enrollment> getEnrolledStudents(@PathVariable Long id)
    {
        if(!repository.existsById(id)) throw new CourseNotFoundException(id);
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!service.allowCourseViewing(person, id))
            throw new UnauthorizedOperationException("Only students enrolled in a course or professors who teach the course may see it");

        List<Enrollment> enrollments = enrollmentService.getCourseEnrollments(id);
        enrollments.forEach(enrollmentService::attachStudent);
        return enrollments;
    }

    @GetMapping("/didactic/course/{id}/grades")
    public List<Grade> getStudentGrades(@PathVariable Long id)
    {
        if(!repository.existsById(id)) throw new CourseNotFoundException(id);
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!service.allowCourseViewing(person, id))
            throw new UnauthorizedOperationException("Only students enrolled in a course or professors who teach the course may see it");

        List<Grade> grades = gradeService.getCourseGrades(id);
        grades.forEach(gradeService::attachStudent);
        return grades;
    }

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @PostMapping("/didactic/course")
    public ResponseEntity<?> newCourse(@RequestBody Course newCourse) {
        newCourse.setId(null); // enforcing to choose a random id the db should create a sequence for id generation
        EntityModel<Course> entityModel = assembler.toModel(repository.save(newCourse));

        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        System.out.println(newCourse);
        if(person.role().equals("ROLE_PROFESOR"))
            teachingService.addTeaching(new Teaching(new TeachingCompositeKey(person.professor().id(), newCourse.getId()), "titular"));

        return ResponseEntity.created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri()).build();
    }

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @PutMapping("/didactic/course/{id}")
    public ResponseEntity<?> replaceCourse(@PathVariable("id") Long id, @RequestBody Course newCourse) {
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!service.authorizeCourseOperation(person, id, true))
            throw new UnauthorizedOperationException("Only professors who teach the course change see it");

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
                }).orElseThrow(() -> new CourseNotFoundException(id));
        EntityModel<Course> entityModel = assembler.toModel(temp);
        return ResponseEntity.created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri()).body(entityModel);
    }

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @DeleteMapping("/didactic/course/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable("id") Long id) throws CourseNotFoundException, IOException {
        Course course = repository.findById(id).orElseThrow(() -> new CourseNotFoundException(id));
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!service.authorizeCourseOperation(person, id, true))
            throw new UnauthorizedOperationException("Only professors who teach the course may delete it");

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

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @PutMapping("/didactic/course/{id}/description")
    public void addDescription(@PathVariable Long id, @RequestBody String description)
    {
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!service.authorizeCourseOperation(person, id, true))
            throw new UnauthorizedOperationException("Only professors who teach the course may change its description");

        service.saveDescription(id, description);
    }

    @GetMapping("/didactic/course/{id}/icon.png")
    public ResponseEntity<?> getIcon(@PathVariable Long id) {
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!service.allowCourseViewing(person, id))
            throw new UnauthorizedOperationException("Only students enrolled in a course or professors who teach the course may see its icon");

        try {
            File iconFile = sftpService.downloadFile("/faculty_files/didactic/course-" + id + "/icon.png", "didactic/course-" + id + "/icon.png");
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
            File iconFile = sftpService.downloadFile("/faculty_files/didactic/default_course_icon.png", "didactic/default_course_icon.png");
            InputStreamResource resource = new InputStreamResource(new FileInputStream(iconFile));

            return ResponseEntity.ok()
                    .contentType(MediaType.IMAGE_PNG)
                    .body(resource);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error retrieving default course icon.");
        }
    }

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @PutMapping("didactic/course/{id}/icon")
    public ResponseEntity<?> updateIcon(@PathVariable Long id, @RequestParam MultipartFile iconFile) {
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!service.authorizeCourseOperation(person, id, true))
            throw new UnauthorizedOperationException("Only students enrolled in a course or professors who teach the course may change its icon");

        try{
            sftpService.uploadFile(iconFile, "faculty_files/didactic/course-" + id, "icon.png");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error uploading icon.");
        }
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @DeleteMapping("didactic/course/{id}/icon")
    public ResponseEntity<?> deleteIcon(@PathVariable Long id) {
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!service.authorizeCourseOperation(person, id, true))
            throw new UnauthorizedOperationException("Only students enrolled in a course or professors who teach the course may delete its icon");

        try{
            sftpService.deleteFile("faculty_files/didactic/course-" + id + "/icon.png", false);
        }
        catch (IOException e) {
            if (e instanceof FileNotFoundException)
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Icon not found.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting icon.");
        }
        return ResponseEntity.ok().build();
    }

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @PutMapping("/didactic/course/{id}/archive")
    public void archiveCourse(@PathVariable Long id)
    {PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!service.authorizeCourseOperation(person, id, true))
            throw new UnauthorizedOperationException("Only students enrolled in a course or professors who teach the course may archive it");

        Course course = repository.findById(id).orElseThrow(() -> new CourseNotFoundException(id));
        course.setArchived(1);
        repository.save(course);
    }

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @PutMapping("/didactic/course/{id}/desarchive")
    public void desarchiveCourse(@PathVariable Long id)
    {
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!service.authorizeCourseOperation(person, id, true))
            throw new UnauthorizedOperationException("Only students enrolled in a course or professors who teach the course may unarchive it");

        Course course = repository.findById(id).orElseThrow(() -> new CourseNotFoundException(id));
        course.setArchived(0);
        repository.save(course);
    }

    @PostMapping("/didactic/course/{id}/upload_csv")
    public ResponseEntity<String> uploadGradesCsv(@RequestParam("file") MultipartFile file, @PathVariable Long id) {
        try {
            gradeService.updateGradesFromCsv(file, id);
            return ResponseEntity.ok("CSV processed successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: " + e.getMessage());
        }
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
