package com.fiiconnect.api;


import com.fiiconnect.api.didactic.exceptions.CourseNotFoundException;
import com.fiiconnect.api.didactic.exceptions.ProfessorNotFoundException;
import com.fiiconnect.api.didactic.models.*;
import com.fiiconnect.api.didactic.repositories.CourseRepository;
import com.fiiconnect.api.didactic.repositories.ProfessorRepository;
import com.fiiconnect.api.didactic.repositories.TeachingRepository;
import com.fiiconnect.api.didactic.services.TeachingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TeachingServiceTest {

    @Mock
    private TeachingRepository teachingRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private ProfessorRepository professorRepository;

    @InjectMocks
    private TeachingService teachingService;

    private Teaching teaching;
    private TeachingCompositeKey key;

    @BeforeEach
    void setUp() {
        key = new TeachingCompositeKey(1L, 2L);
        teaching = new Teaching();
        teaching.setId(key);
    }

    @Test
    void testAttachCourse_success() {
        Course course = new Course();
        course.setId(2L);

        when(courseRepository.findById(2L)).thenReturn(Optional.of(course));

        teachingService.attachCourse(teaching);

        assertNotNull(teaching.getCourse());
        assertEquals(2L, teaching.getCourse().getId());
    }

    @Test
    void testAttachCourse_courseNotFound() {
        when(courseRepository.findById(2L)).thenReturn(Optional.empty());

        assertThrows(CourseNotFoundException.class, () -> teachingService.attachCourse(teaching));
    }

    @Test
    void testAttachProfessor_success() {
        Professor professor = new Professor();
        professor.setId(1L);

        when(professorRepository.findById(1L)).thenReturn(Optional.of(professor));

        teachingService.attachProfessor(teaching);

        assertNotNull(teaching.getProfessor());
        assertEquals(1L, teaching.getProfessor().getId());
    }

    @Test
    void testAttachProfessor_professorNotFound() {
        when(professorRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ProfessorNotFoundException.class, () -> teachingService.attachProfessor(teaching));
    }
}

