package com.fiiconnect.api.didactic.services;

import com.fiiconnect.api.didactic.exceptions.StudentNotFoundException;
import com.fiiconnect.api.didactic.models.Grade;
import com.fiiconnect.api.didactic.models.Student;
import com.fiiconnect.api.didactic.repositories.GradeRepository;
import com.fiiconnect.api.didactic.repositories.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GradeService {
    private final GradeRepository repository;
    private final StudentRepository studentRepository;

    public GradeService(GradeRepository repository, StudentRepository studentRepository) {
        this.repository = repository;
        this.studentRepository = studentRepository;
    }

    public List<Grade> getCourseGrades(Long idCourse)
    {
        return repository.findByIdIdCourse(idCourse);
    }

    public List<Grade> getStudentGrades(Long idStud)
    {
        return repository.findByIdIdStud(idStud);
    }

    public void attachStudent(Grade grade)
    {
        Long idStud = grade.getId().getIdStud();
        Student student = studentRepository.findById(idStud).orElseThrow(() -> new StudentNotFoundException(idStud));
        grade.setStudent(student);
    }
}
