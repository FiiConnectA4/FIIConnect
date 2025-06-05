package com.fiiconnect.api.didactic.services;

import com.fiiconnect.api.auth_userMgmt.controllers.PersonController;
import com.fiiconnect.api.didactic.repositories.CourseRepository;
import com.fiiconnect.api.didactic.repositories.ProfessorRepository;
import com.fiiconnect.api.didactic.exceptions.CourseNotFoundException;
import com.fiiconnect.api.didactic.exceptions.ProfessorNotFoundException;
import com.fiiconnect.api.didactic.models.Teaching;
import com.fiiconnect.api.didactic.repositories.TeachingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TeachingService {
    private final CourseRepository courseRepo;
    private final ProfessorRepository professorRepo;
    private final TeachingRepository repository;
    private final PersonController personController;

    public TeachingService(CourseRepository courseRepo, ProfessorRepository professorRepo, TeachingRepository repository, PersonController personController) {
        this.courseRepo = courseRepo;
        this.professorRepo = professorRepo;
        this.repository = repository;
        this.personController = personController;
    }

    public void addTeaching(Teaching teach)
    {
        repository.save(teach);
    }

    public void attachCourse(Teaching teach) {
        Long idCourse = teach.getId().getIdCourse();
        teach.setCourse(courseRepo.findById(idCourse).orElseThrow(() -> new CourseNotFoundException(idCourse)));
    }

    public void attachProfessor(Teaching teach) {
        Long idProf = teach.getId().getIdProf();
        teach.setProfessor(professorRepo.findById(idProf).orElseThrow(() -> new ProfessorNotFoundException(idProf)));
    }
}
