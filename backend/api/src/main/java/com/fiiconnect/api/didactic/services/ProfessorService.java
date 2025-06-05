package com.fiiconnect.api.didactic.services;

import com.fiiconnect.api.auth_userMgmt.dtos.BulkNotificationRequest;
import com.fiiconnect.api.auth_userMgmt.dtos.PersonInfoDTO;
import com.fiiconnect.api.auth_userMgmt.models.User;
import com.fiiconnect.api.auth_userMgmt.repositories.UserRepository;
import com.fiiconnect.api.auth_userMgmt.services.NotificationService;
import com.fiiconnect.api.didactic.repositories.TeachingRepository;
import com.fiiconnect.api.didactic.models.Professor;
import com.fiiconnect.api.didactic.models.Teaching;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class ProfessorService {
    private final TeachingRepository teachingRepo;
    private final TeachingService teachingService;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

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

    public void notifyProfessorUser(Long professorId, String title, String content, String type)
    {
        User professor = userRepository.findByStudentId(professorId).orElse(null);
        if(professor != null)
        {
            BulkNotificationRequest req = new BulkNotificationRequest();
            req.setTitle(title);
            req.setContent(content);
            req.setType(type);
            notificationService.sendToOne(professor, req);
        }
    }
}
