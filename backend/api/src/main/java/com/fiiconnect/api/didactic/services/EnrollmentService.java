package com.fiiconnect.api.didactic.services;

import com.fiiconnect.api.didactic.exceptions.CourseNotFoundException;
import com.fiiconnect.api.didactic.exceptions.StudentNotFoundException;
import com.fiiconnect.api.didactic.models.Course;
import com.fiiconnect.api.didactic.models.Enrollment;
import com.fiiconnect.api.didactic.models.Student;
import com.fiiconnect.api.didactic.repositories.CourseRepository;
import com.fiiconnect.api.didactic.repositories.EnrollmentRepository;
import com.fiiconnect.api.didactic.repositories.StudentRepository;
import org.springframework.stereotype.Service;

@Service
public class EnrollmentService {
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository repository;

    public EnrollmentService(StudentRepository studentRepository, CourseRepository courseRepository, EnrollmentRepository repository) {
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.repository = repository;
    }

    public void attachStudent(Enrollment enrollment)
    {
        Long idStud = enrollment.getId().getIdStud();
        Student student = studentRepository.findById(idStud).orElseThrow(() -> new StudentNotFoundException(idStud));
        enrollment.setStudent(student);
    }

    public void attachCourse(Enrollment enrollment)
    {
        Long idCourse = enrollment.getId().getIdCourse();
        Course course = courseRepository.findById(idCourse).orElseThrow(() -> new CourseNotFoundException(idCourse));
        enrollment.setCourse(course);
    }
}
