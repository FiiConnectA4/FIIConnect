package com.fiiconnect.api;

import com.fiiconnect.api.didactic.controllers.CourseController;
import com.fiiconnect.api.didactic.exceptions.CourseNotFoundException;
import com.fiiconnect.api.didactic.models.Course;
import com.fiiconnect.api.didactic.models.CourseModelAssembler;
import com.fiiconnect.api.didactic.repositories.CourseRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.hateoas.Link;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ActiveProfiles("test")
@SpringBootTest
@ExtendWith(MockitoExtension.class)
public class CourseControllerTest {

    @Mock
    private CourseRepository repository;

    @Mock
    private CourseModelAssembler assembler;

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
    // test get
    @Test
    void all_ReturnsAllCourses() {
        List<Course> courses = Arrays.asList(course);
        EntityModel<Course> courseEntityModel = EntityModel.of(course, Link.of("/didactic/course/1").withSelfRel());
        when(repository.findAll()).thenReturn(courses);
        when(assembler.toModel(any(Course.class))).thenReturn(courseEntityModel);

        CollectionModel<EntityModel<Course>> result = controller.all();

        assertNotNull(result);
        assertEquals(1, result.getContent().size());
        assertTrue(result.getLinks().hasLink("self"));
        assertEquals("/didactic/course", result.getLinks().getLink("self").get().getHref());
        verify(repository, times(1)).findAll();
        verify(assembler, times(1)).toModel(course);
    }
    // test get
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

    // test post
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

        assertEquals(201, response.getStatusCode().value()); // 201 Created
        assertEquals("/didactic/course/2", response.getHeaders().getLocation().toString());
        verify(repository, times(1)).save(any(Course.class));
        verify(assembler, times(1)).toModel(savedCourse);
    }
    // test put
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

        assertEquals(201, response.getStatusCode().value()); // 201 Created
        assertEquals("/didactic/course/1", response.getHeaders().getLocation().toString());
        assertEquals(updatedCourse, ((EntityModel<Course>) response.getBody()).getContent());
        verify(repository, times(1)).findById(1L);
        verify(repository, times(1)).save(any(Course.class));
        verify(assembler, times(1)).toModel(updatedCourse);
    }

    @Test
    void replaceCourse_CreatesNewCourse_WhenCourseDoesNotExist() {
        // Arrange
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

        assertEquals(201, response.getStatusCode().value()); // 201 Created
        assertEquals("/didactic/course/1", response.getHeaders().getLocation().toString());
        assertEquals(savedCourse, ((EntityModel<Course>) response.getBody()).getContent());
        verify(repository, times(1)).findById(1L);
        verify(repository, times(1)).save(any(Course.class));
        verify(assembler, times(1)).toModel(savedCourse);
    }

    @Test
    void deleteCourse_DeletesCourseSuccessfully() {
        doNothing().when(repository).deleteById(1L);

        ResponseEntity<?> response = controller.deleteCourse(1L);

        assertEquals(204, response.getStatusCode().value());
        verify(repository, times(1)).deleteById(1L);
        verify(assembler, never()).toModel(any());
    }

    @Test
    void deleteCourse_ThrowsException_WhenCourseNotFound() {
        doThrow(new RuntimeException("Course not found")).when(repository).deleteById(1L);

        assertThrows(RuntimeException.class, () -> controller.deleteCourse(1L));
        verify(repository, times(1)).deleteById(1L);
        verify(assembler, never()).toModel(any());
    }
}