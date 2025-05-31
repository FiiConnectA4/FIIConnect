package com.fiiconnect.api.didactic.services;

import com.fiiconnect.api.auth_userMgmt.dtos.personDTO.PersonInfoDTO;
import com.fiiconnect.api.didactic.repositories.TeachingRepository;
import com.fiiconnect.api.didactic.models.Professor;
import com.fiiconnect.api.didactic.models.Teaching;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProfessorService {
    private final TeachingRepository teachingRepo;
    private final TeachingService teachingService;

    public ProfessorService(TeachingRepository teachingRepo, TeachingService teachingService) {
        this.teachingRepo = teachingRepo;
        this.teachingService = teachingService;
    }

    public void attachCourses(Professor professor) {
        List<Teaching> teachingInfo = teachingRepo.findByIdIdProf(professor.getId());
        teachingInfo.forEach(teachingService::attachCourse);
        professor.setCourses(teachingInfo);
    }

    public void limitVisibility(Professor professor, PersonInfoDTO person, boolean attachFull)
    {
        if(attachFull && (person.role().equals("ROLE_ADMIN") || (person.role().equals("ROLE_PROFESOR") && person.professor().id().equals(professor.getId()))))
        {
            attachCourses(professor);
        }
        else
        {
            professor.setCnp(null);
        }
    }
}
