package com.fiiconnect.api.didactic.services;

import com.fiiconnect.api.didactic.models.Enrollment;
import com.fiiconnect.api.didactic.models.Student;
import com.fiiconnect.api.didactic.repositories.EnrollmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {

    private final EnrollmentRepository enrollmentRepository;
    private final EnrollmentService enrollmentService;

    public StudentService(EnrollmentRepository enrollmentRepository, EnrollmentService enrollmentService) {
        this.enrollmentRepository = enrollmentRepository;
        this.enrollmentService = enrollmentService;
    }

    public void attachEnrollments(Student student) {
        List<Enrollment> enrollments = enrollmentRepository.findByIdIdStud(student.getId());
        enrollments.forEach(enrollmentService::attachCourse);
        student.setEnrollments(enrollments);
    }
}
