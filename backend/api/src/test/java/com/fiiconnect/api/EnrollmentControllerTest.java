package com.fiiconnect.api;

import com.fiiconnect.api.didactic.controllers.EnrollmentController;
import com.fiiconnect.api.didactic.models.Enrollment;
import com.fiiconnect.api.didactic.models.EnrollmentCompositeKey;
import com.fiiconnect.api.didactic.repositories.EnrollmentRepository;
import com.fiiconnect.api.didactic.services.EnrollmentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class EnrollmentControllerTest {

    @Mock
    private EnrollmentRepository repository;

    @Mock
    private EnrollmentService service;

    @InjectMocks
    private EnrollmentController controller;

    private Enrollment enrollment;

    @BeforeEach
    void setUp() {
        EnrollmentCompositeKey key = new EnrollmentCompositeKey(1L, 100L);
        enrollment = new Enrollment();
        enrollment.setId(key);
        enrollment.setFacultyGroup("GroupA");
    }

    @Test
    void addEnrollment_SavesEnrollmentSuccessfully() {
        when(repository.save(any(Enrollment.class))).thenReturn(enrollment);

        assertDoesNotThrow(() -> controller.addEnrollment(enrollment));
        verify(repository, times(1)).save(enrollment);
    }

    @Test
    void deleteEnrollment_DeletesSuccessfully() {
        EnrollmentCompositeKey key = enrollment.getId();

        doNothing().when(repository).deleteById(key);

        assertDoesNotThrow(() -> controller.deleteEnrollment(key.getIdStud(), key.getIdCourse()));
        verify(repository, times(1)).deleteById(key);
    }
}

