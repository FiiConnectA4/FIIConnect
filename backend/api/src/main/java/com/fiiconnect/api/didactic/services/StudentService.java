package com.fiiconnect.api.didactic.services;

import com.fiiconnect.api.auth_userMgmt.dtos.PersonInfoDTO;
import com.fiiconnect.api.didactic.models.Enrollment;
import com.fiiconnect.api.didactic.models.Grade;
import com.fiiconnect.api.didactic.models.Student;
import com.fiiconnect.api.didactic.repositories.EnrollmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentService {
    private final EnrollmentRepository enrollmentRepository;
    private final EnrollmentService enrollmentService;
    private final GradeService gradeService;

    public StudentService(EnrollmentRepository enrollmentRepository, EnrollmentService enrollmentService, GradeService gradeService) {
        this.enrollmentRepository = enrollmentRepository;
        this.enrollmentService = enrollmentService;
        this.gradeService = gradeService;
    }

    public void attachEnrollments(Student student) {
        List<Enrollment> enrollments = enrollmentRepository.findByIdIdStud(student.getId());
        enrollments.forEach(enrollmentService::attachCourse);
        student.setEnrollments(enrollments);
    }

    public void attachGrades(Student student)
    {
        List<Grade> grades = gradeService.getStudentGrades(student.getId());
        student.setGrades(grades);
    }

    public void limitVisibility(Student student, PersonInfoDTO person, boolean attachFull)
    {
        if(attachFull && (person.role().equals("ROLE_ADMIN") || (person.role().equals("ROLE_STUDENT") && person.student().id().equals(student.getId()))))
        {
            attachEnrollments(student);
            attachGrades(student);
        }
        else
        {
            student.setCnp(null);
        }
    }
}
