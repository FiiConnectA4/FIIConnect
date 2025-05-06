package com.fiiconnect.api.didactic.services;

import com.fiiconnect.api.didactic.repositories.CourseRepository;
import com.fiiconnect.api.didactic.repositories.ProfessorRepository;
import com.fiiconnect.api.didactic.repositories.TeachingRepository;
import com.fiiconnect.api.didactic.exceptions.CourseNotFoundException;
import com.fiiconnect.api.didactic.exceptions.ProfessorNotFoundException;
import com.fiiconnect.api.didactic.models.Teaching;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class TeachingService {
    @Autowired
    private final TeachingRepository repo;
    private final CourseRepository courseRepo;
    private final ProfessorRepository professorRepo;

    public TeachingService(TeachingRepository repo, CourseRepository courseRepo, ProfessorRepository professorRepo) {
        this.repo = repo;
        this.courseRepo = courseRepo;
        this.professorRepo = professorRepo;
    }

    public void attachCourse(Teaching teach)
    {
        Long idCourse = teach.getId().getIdCourse();
        teach.setCourse(courseRepo.findById(idCourse).orElseThrow(() -> new CourseNotFoundException(idCourse)));
    }

    public void attachProfessor(Teaching teach)
    {
        Long idProf = teach.getId().getIdProf();
        teach.setProfessor(professorRepo.findById(idProf).orElseThrow(() -> new ProfessorNotFoundException(idProf)));
    }
}
