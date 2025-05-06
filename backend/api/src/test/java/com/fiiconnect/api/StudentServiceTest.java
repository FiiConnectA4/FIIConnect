package com.fiiconnect.api;

import com.fiiconnect.api.didactic.models.Enrollment;
import com.fiiconnect.api.didactic.models.EnrollmentCompositeKey;
import com.fiiconnect.api.didactic.models.Student;
import com.fiiconnect.api.didactic.repositories.EnrollmentRepository;
import com.fiiconnect.api.didactic.repositories.StudentRepository;
import com.fiiconnect.api.didactic.services.EnrollmentService;
import com.fiiconnect.api.didactic.services.StudentService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @Mock
    private EnrollmentRepository enrollmentRepository;

    @Mock
    private EnrollmentService enrollmentService;

    @InjectMocks
    private StudentService studentService;

    private Student student;
    private Enrollment enrollment;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        student = new Student();
        student.setId(1L);

        enrollment = new Enrollment();
        EnrollmentCompositeKey compositeKey = new EnrollmentCompositeKey(1L, 2L);
        enrollment.setId(compositeKey);
    }


    @Test
    void attachEnrollments_AttachesEnrollmentsToStudent() {
        when(enrollmentRepository.findByIdIdStud(1L)).thenReturn(List.of(enrollment));

        studentService.attachEnrollments(student);

        assertNotNull(student.getEnrollments());
        assertEquals(1, student.getEnrollments().size());
        verify(enrollmentService).attachCourse(enrollment);
    }
}

