package com.fiiconnect.api.didactic.services;

import com.fiiconnect.api.didactic.repositories.ProfessorRepository;
import com.fiiconnect.api.didactic.repositories.TeachingRepository;
import com.fiiconnect.api.didactic.models.Professor;
import com.fiiconnect.api.didactic.models.Teaching;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfessorService {
    private final ProfessorRepository repository;
    private final TeachingRepository teachingRepo;
    private final TeachingService teachingService;

    public ProfessorService(ProfessorRepository repository, TeachingRepository teachingRepo, TeachingService teachingService) {
        this.repository = repository;
        this.teachingRepo = teachingRepo;
        this.teachingService = teachingService;
    }

    public void attachCourses(Professor professor)
    {
        List<Teaching> teachingInfo = teachingRepo.findByIdIdProf(professor.getId());
        teachingInfo.forEach(teachingService::attachCourse);
        professor.setCourses(teachingInfo);
    }
}
