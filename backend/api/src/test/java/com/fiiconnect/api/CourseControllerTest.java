package com.fiiconnect.api;

import com.fiiconnect.api.didactic.controllers.CourseController;
import com.fiiconnect.api.didactic.exceptions.CourseNotFoundException;
import com.fiiconnect.api.didactic.helpers.SQLExceptionMessageParser;
import com.fiiconnect.api.didactic.models.Course;
import com.fiiconnect.api.didactic.models.CourseModelAssembler;
import com.fiiconnect.api.didactic.models.Enrollment;
import com.fiiconnect.api.didactic.repositories.CourseRepository;
import com.fiiconnect.api.didactic.services.CourseMaterialService;
import com.fiiconnect.api.didactic.services.CourseService;
import com.fiiconnect.api.didactic.services.EnrollmentService;
import com.fiiconnect.api.didactic.services.SftpService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.ResponseEntity;

import java.io.IOException;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.any;
@ExtendWith(MockitoExtension.class)
public class CourseControllerTest {

    @Mock
    private CourseRepository repository;
    @Mock
    private CourseService service;
    @Mock
    private CourseModelAssembler assembler;
    @Mock
    private EnrollmentService enrollmentService;
    @Mock
    private CourseMaterialService materialService;
    @Mock
    private SftpService sftpService;
    @Mock
    private SQLExceptionMessageParser exceptionHelper;

    @InjectMocks
    private CourseController controller;

    private Course course;

    @BeforeEach
    void setUp() {
        course = new Course();
        course.setId(1L);
        course.setCode("CS101");
        course.setTitle("Introduction to Programming");
        course.setCredits(4);
        course.setYear(1);
        course.setSemester(1);
        course.setArchived(0);
    }

    @Test
    void all_ReturnsAllCourses() {
        List<Course> courses = Arrays.asList(course);
        EntityModel<Course> courseEntityModel = EntityModel.of(course);
        when(repository.findAll()).thenReturn(courses);
        when(assembler.toModel(any(Course.class))).thenReturn(courseEntityModel);

        CollectionModel<EntityModel<Course>> result = controller.all();

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(repository, times(1)).findAll();
        verify(assembler, times(1)).toModel(course);
    }

    @Test
    void one_ReturnsCourse_WhenCourseExists() {
        EntityModel<Course> courseEntityModel = EntityModel.of(course, Link.of("/didactic/course/1").withSelfRel());
        when(repository.findById(1L)).thenReturn(Optional.of(course));
        when(assembler.toModel(course)).thenReturn(courseEntityModel);

        EntityModel<Course> result = controller.one(1L);

        assertNotNull(result);
        assertEquals(course, result.getContent());
        assertTrue(result.getLinks().hasLink(IanaLinkRelations.SELF));
        verify(repository, times(1)).findById(1L);
        verify(assembler, times(1)).toModel(course);
    }

    @Test
    void one_ThrowsException_WhenCourseNotFound() {
        when(repository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(CourseNotFoundException.class, () -> controller.one(1L));
        verify(repository, times(1)).findById(1L);
        verify(assembler, never()).toModel(any());
    }

    @Test
    void newCourse_CreatesCourseSuccessfully() {
        Course newCourse = new Course();
        newCourse.setCode("CS102");
        newCourse.setTitle("Advanced Programming");
        newCourse.setCredits(4);
        newCourse.setYear(2);
        newCourse.setSemester(1);
        newCourse.setArchived(0);

        Course savedCourse = new Course();
        savedCourse.setId(2L);
        savedCourse.setCode(newCourse.getCode());
        savedCourse.setTitle(newCourse.getTitle());
        savedCourse.setCredits(newCourse.getCredits());
        savedCourse.setYear(newCourse.getYear());
        savedCourse.setSemester(newCourse.getSemester());
        savedCourse.setArchived(newCourse.getArchived());

        EntityModel<Course> savedEntityModel = EntityModel.of(savedCourse, Link.of("/didactic/course/2").withSelfRel());
        when(repository.save(any(Course.class))).thenReturn(savedCourse);
        when(assembler.toModel(savedCourse)).thenReturn(savedEntityModel);

        ResponseEntity<?> response = controller.newCourse(newCourse);

        assertEquals(201, response.getStatusCode().value());
        assertEquals("/didactic/course/2", response.getHeaders().getLocation().toString());
        verify(repository, times(1)).save(any(Course.class));
        verify(assembler, times(1)).toModel(savedCourse);
    }

    @Test
    void replaceCourse_UpdatesCourse_WhenCourseExists() {
        Course existingCourse = new Course();
        existingCourse.setId(1L);
        existingCourse.setCode("CS101");
        existingCourse.setTitle("Old Title");

        Course newCourse = new Course();
        newCourse.setCode("CS101");
        newCourse.setTitle("New Title");
        newCourse.setCredits(4);
        newCourse.setYear(1);
        newCourse.setSemester(1);
        newCourse.setArchived(0);

        Course updatedCourse = new Course();
        updatedCourse.setId(1L);
        updatedCourse.setCode(newCourse.getCode());
        updatedCourse.setTitle(newCourse.getTitle());
        updatedCourse.setCredits(newCourse.getCredits());
        updatedCourse.setYear(newCourse.getYear());
        updatedCourse.setSemester(newCourse.getSemester());
        updatedCourse.setArchived(newCourse.getArchived());

        EntityModel<Course> updatedEntityModel = EntityModel.of(updatedCourse, Link.of("/didactic/course/1").withSelfRel());
        when(repository.findById(1L)).thenReturn(Optional.of(existingCourse));
        when(repository.save(any(Course.class))).thenReturn(updatedCourse);
        when(assembler.toModel(updatedCourse)).thenReturn(updatedEntityModel);

        ResponseEntity<?> response = controller.replaceCourse(1L, newCourse);

        assertEquals(201, response.getStatusCode().value());
        assertEquals("/didactic/course/1", response.getHeaders().getLocation().toString());
        assertEquals(updatedCourse, ((EntityModel<Course>) response.getBody()).getContent());
        verify(repository, times(1)).findById(1L);
        verify(repository, times(1)).save(any(Course.class));
        verify(assembler, times(1)).toModel(updatedCourse);
    }

    @Test
    void replaceCourse_CreatesNewCourse_WhenCourseDoesNotExist() {
        Course newCourse = new Course();
        newCourse.setCode("CS101");
        newCourse.setTitle("New Title");
        newCourse.setCredits(4);
        newCourse.setYear(1);
        newCourse.setSemester(1);
        newCourse.setArchived(0);

        Course savedCourse = new Course();
        savedCourse.setId(1L);
        savedCourse.setCode(newCourse.getCode());
        savedCourse.setTitle(newCourse.getTitle());
        savedCourse.setCredits(newCourse.getCredits());
        savedCourse.setYear(newCourse.getYear());
        savedCourse.setSemester(newCourse.getSemester());
        savedCourse.setArchived(newCourse.getArchived());

        EntityModel<Course> savedEntityModel = EntityModel.of(savedCourse, Link.of("/didactic/course/1").withSelfRel());
        when(repository.findById(1L)).thenReturn(Optional.empty());
        when(repository.save(any(Course.class))).thenReturn(savedCourse);
        when(assembler.toModel(savedCourse)).thenReturn(savedEntityModel);

        ResponseEntity<?> response = controller.replaceCourse(1L, newCourse);

        assertEquals(201, response.getStatusCode().value());
        assertEquals("/didactic/course/1", response.getHeaders().getLocation().toString());
        assertEquals(savedCourse, ((EntityModel<Course>) response.getBody()).getContent());
        verify(repository, times(1)).findById(1L);
        verify(repository, times(1)).save(any(Course.class));
        verify(assembler, times(1)).toModel(savedCourse);
    }

    @Test
    void deleteCourse_DeletesCourseSuccessfully() throws IOException {
        when(repository.findById(1L)).thenReturn(Optional.of(course));
        when(sftpService.checkExists(anyString())).thenReturn(false);
        doAnswer(invocation -> {
            Course c = invocation.getArgument(0);
            c.setMaterials(Collections.emptyList());
            return null;
        }).when(service).attachMaterials(any(Course.class));
        doNothing().when(repository).delete(any(Course.class));

        ResponseEntity<?> response = controller.deleteCourse(1L);

        assertEquals(204, response.getStatusCode().value());
        verify(repository, times(1)).findById(1L);
        verify(service, times(1)).attachMaterials(course);
        verify(sftpService, times(1)).checkExists("faculty_files/didactic/course-1/");
        verify(materialService, never()).deleteMaterial(any());
        verify(repository, times(1)).delete(course);
        verify(assembler, never()).toModel(any());
    }

    @Test
    void deleteCourse_ThrowsException_WhenCourseNotFound() throws IOException {
        when(repository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(CourseNotFoundException.class, () -> controller.deleteCourse(1L));
        verify(repository, times(1)).findById(1L);
        verify(repository, never()).delete(any());
        verify(service, never()).attachMaterials(any());
        verify(sftpService, never()).checkExists(anyString());
        verify(assembler, never()).toModel(any());
    }

    @Test
    void allCourse_ReturnsCourses_WhenCoursesExistForYearAndSemester() {
        // Given
        List<Course> courses = Arrays.asList(course);
        EntityModel<Course> courseEntityModel = EntityModel.of(course);
        when(service.viewAllCoursesAvailable(1, 1)).thenReturn(courses);
        when(assembler.toModel(any(Course.class))).thenReturn(courseEntityModel);

        // When
        CollectionModel<EntityModel<Course>> result = controller.allCourse(1, 1);

        // Then
        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        verify(service, times(1)).viewAllCoursesAvailable(1, 1);
        verify(assembler, times(1)).toModel(course);
    }
    @Test
    void getEnrolledStudents_ReturnsEnrolledStudents() {
        // Given
        List<Enrollment> enrollments = Collections.singletonList(new Enrollment());
        when(enrollmentService.getCourseEnrollments(1L)).thenReturn(enrollments);

        // When
        List<Enrollment> result = controller.getEnrolledStudents(1L);

        // Then
        assertNotNull(result);
        assertEquals(1, result.size());
        verify(enrollmentService, times(1)).getCourseEnrollments(1L);
    }
    @Test
    void addDescription_AddsDescriptionToCourse() {
        // Given
        String description = "This is a course description.";

        // When
        controller.addDescription(1L, description);

        // Then
        verify(service, times(1)).saveDescription(1L, description);
    }
    @Test
    void archiveCourse_ArchivesCourse_WhenCourseExists() {
        // Given
        when(repository.findById(1L)).thenReturn(Optional.of(course));

        // When
        controller.archiveCourse(1L);

        // Then
        assertEquals(1, course.getArchived());
        verify(repository, times(1)).findById(1L);
        verify(repository, times(1)).save(course);
    }

}
