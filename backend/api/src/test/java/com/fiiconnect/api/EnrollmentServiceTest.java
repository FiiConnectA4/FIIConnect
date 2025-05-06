package com.fiiconnect.api;

import com.fiiconnect.api.didactic.exceptions.CourseNotFoundException;
import com.fiiconnect.api.didactic.exceptions.StudentNotFoundException;
import com.fiiconnect.api.didactic.models.*;
import com.fiiconnect.api.didactic.repositories.CourseRepository;
import com.fiiconnect.api.didactic.repositories.EnrollmentRepository;
import com.fiiconnect.api.didactic.repositories.StudentRepository;
import com.fiiconnect.api.didactic.services.EnrollmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class EnrollmentServiceTest {

    private StudentRepository studentRepository;
    private CourseRepository courseRepository;
    private EnrollmentRepository enrollmentRepository;
    private EnrollmentService enrollmentService;

    private Enrollment enrollment;
    private EnrollmentCompositeKey key;

    @BeforeEach
    void setUp() {
        studentRepository = mock(StudentRepository.class);
        courseRepository = mock(CourseRepository.class);
        enrollmentRepository = mock(EnrollmentRepository.class);
        enrollmentService = new EnrollmentService(studentRepository, courseRepository, enrollmentRepository);

        key = new EnrollmentCompositeKey(1L, 2L);
        enrollment = new Enrollment();
        enrollment.setId(key);
    }

    @Test
    void testAttachStudent_success() {
        Student student = new Student();
        student.setId(1L);

        when(studentRepository.findById(1L)).thenReturn(Optional.of(student));

        enrollmentService.attachStudent(enrollment);

        assertNotNull(enrollment.getStudent());
        assertEquals(1L, enrollment.getStudent().getId());
        verify(studentRepository, times(1)).findById(1L);
    }

    @Test
    void testAttachStudent_studentNotFound() {
        when(studentRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(StudentNotFoundException.class, () -> enrollmentService.attachStudent(enrollment));
        verify(studentRepository, times(1)).findById(1L);
    }

    @Test
    void testAttachCourse_success() {
        Course course = new Course();
        course.setId(2L);

        when(courseRepository.findById(2L)).thenReturn(Optional.of(course));

        enrollmentService.attachCourse(enrollment);

        assertNotNull(enrollment.getCourse());
        assertEquals(2L, enrollment.getCourse().getId());
        verify(courseRepository, times(1)).findById(2L);
    }

    @Test
    void testAttachCourse_courseNotFound() {
        when(courseRepository.findById(2L)).thenReturn(Optional.empty());

        assertThrows(CourseNotFoundException.class, () -> enrollmentService.attachCourse(enrollment));
        verify(courseRepository, times(1)).findById(2L);
    }
}

