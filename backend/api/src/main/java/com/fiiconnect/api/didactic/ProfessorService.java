package com.fiiconnect.api.didactic;

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

    void attachCourses(Professor professor)
    {
        List<Teaching> teachingInfo = teachingRepo.findByIdIdProf(professor.getId());
        teachingInfo.forEach(teachingService::attachCourse);
        professor.setCourses(teachingInfo);
    }
}
