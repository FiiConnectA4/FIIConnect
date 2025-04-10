package com.fiiconnect.api.didactic;

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

    void attachCourse(Teaching teach)
    {
        Long idCourse = teach.getId().getIdCourse();
        teach.setCourse(courseRepo.findById(idCourse).orElseThrow(() -> new CourseNotFoundException(idCourse)));
    }

    void attachProfessor(Teaching teach)
    {
        Long idProf = teach.getId().getIdProf();
        teach.setProfessor(professorRepo.findById(idProf).orElseThrow(() -> new ProfessorNotFoundException(idProf)));
    }
}
