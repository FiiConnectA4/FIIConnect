package com.fiiconnect.api.didactic.services;

import com.fiiconnect.api.didactic.exceptions.CourseNotFoundException;
import com.fiiconnect.api.didactic.exceptions.StudentAlreadyEnrolledInCourse;
import com.fiiconnect.api.didactic.exceptions.StudentNotFoundException;
import com.fiiconnect.api.didactic.models.*;
import com.fiiconnect.api.didactic.repositories.CourseRepository;
import com.fiiconnect.api.didactic.repositories.EnrollmentRepository;
import com.fiiconnect.api.didactic.repositories.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

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

    public void updateEnroll(Long idStud, Long idCourse, String group){
        if(studentRepository.findById(idStud).isEmpty())
            throw new StudentNotFoundException(idStud);
        if(courseRepository.findById(idCourse).isEmpty())
            throw new CourseNotFoundException(idCourse);
        var enrollment_key = new EnrollmentCompositeKey(idStud, idCourse);
        if(repository.existsById(enrollment_key))
            repository.deleteById(enrollment_key);
        Enrollment enrollment = new Enrollment(enrollment_key, group);
        repository.save(enrollment);
    }

    public List<Enrollment> getCourseEnrollments(Long idCourse)
    {
        return repository.findByIdIdCourse(idCourse);
    }
}
