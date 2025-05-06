package com.fiiconnect.api;

import com.fiiconnect.api.didactic.controllers.StudentController;
import com.fiiconnect.api.didactic.exceptions.StudentNotFoundException;
import com.fiiconnect.api.didactic.models.Student;
import com.fiiconnect.api.didactic.repositories.StudentRepository;
import com.fiiconnect.api.didactic.services.StudentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class StudentControllerTest {

    @Mock
    private StudentRepository repository;

    @Mock
    private StudentService service;

    @InjectMocks
    private StudentController controller;

    private Student student;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        student = new Student();
        student.setId(1L);
        student.setFirstName("John");
        student.setLastName("Doe");
    }

    @Test
    void all_ReturnsListOfStudents() {
        when(repository.findAll()).thenReturn(List.of(student));

        List<Student> result = controller.all();

        assertEquals(1, result.size());
        verify(repository).findAll();
    }

    @Test
    void one_ValidId_ReturnsStudentWithEnrollmentsAttached() {
        when(repository.findById(1L)).thenReturn(Optional.of(student));

        Student result = controller.one(1L);

        assertEquals("John", result.getFirstName());
        verify(service).attachEnrollments(student);
    }

    @Test
    void one_InvalidId_ThrowsStudentNotFoundException() {
        when(repository.findById(2L)).thenReturn(Optional.empty());

        assertThrows(StudentNotFoundException.class, () -> controller.one(2L));
    }
}

