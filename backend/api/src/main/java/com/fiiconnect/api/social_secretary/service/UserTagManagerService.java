package com.fiiconnect.api.social_secretary.service;

import com.fiiconnect.api.auth_userMgmt.dtos.PersonInfoDTO;
import com.fiiconnect.api.auth_userMgmt.models.User;
import com.fiiconnect.api.auth_userMgmt.repositories.UserRepository;
import com.fiiconnect.api.didactic.models.Course;
import com.fiiconnect.api.didactic.models.Enrollment;
import com.fiiconnect.api.didactic.models.Student;
import com.fiiconnect.api.didactic.repositories.CourseRepository;
import com.fiiconnect.api.didactic.repositories.EnrollmentRepository;
import com.fiiconnect.api.social_secretary.DTO.TagDTO;
import com.fiiconnect.api.social_secretary.classes.Tag;
import com.fiiconnect.api.social_secretary.enums.TagType;
import com.fiiconnect.api.social_secretary.repository.TagRepository;
import com.fiiconnect.api.social_secretary.repository.UserTagManagerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static org.springframework.web.servlet.function.ServerResponse.status;

@Service
public class UserTagManagerService {

    @Autowired
    UserTagManagerRepository userTagManagerRepository;

    @Autowired
    TagRepository tagRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    EnrollmentRepository enrollmentRepository;

    @Autowired
    CourseRepository courseRepository;

    public ResponseEntity<?> addTagToUser(Long whoIsLoggedId, Long userId, Long tagId) {
        User user = userRepository.findById(whoIsLoggedId).orElse(null);
        if (user.getRoles().stream().findFirst().get().getRoleName().equals("ROLE_ADMIN") ||
                user.getRoles().stream().findFirst().get().getRoleName().equals("ROLE_SECRETARY")) {
            userTagManagerRepository.addTagToUser(userId, tagId);
            return ResponseEntity.status(200).body("tag atribuit cu succes");
        } else {
            return ResponseEntity.status(401).body(
                    "acest user nu are privilegii de adaugare de taguri"
            );
        }
    }

    public ResponseEntity<List<TagDTO>> getAllUserTags(Long userId) {
        List<Long> tagIds = userTagManagerRepository.getAllUserTags(userId);
        return ResponseEntity.status(200).body(
                tagIds.stream().
                        map(tagId -> tagRepository.findById(tagId).orElse(null)).
                        map(tag -> new TagDTO(tag.getId(), tag.getName(), tag.getType())).
                        collect(Collectors.toList()));
    }

    public ResponseEntity<String> removeTagFromUser(Long whoIsLoggedId, Long userId, Long tagId) {
        User user = userRepository.findById(whoIsLoggedId).orElse(null);
        if (user.getRoles().stream().findFirst().get().getRoleName().equals("ROLE_ADMIN") ||
                user.getRoles().stream().findFirst().get().getRoleName().equals("ROLE_SECRETARY")) {
            userTagManagerRepository.deleteByUserIdAndTagId(userId, tagId);
            return ResponseEntity.status(200).body("tag atribuit cu succes");
        } else {
            return ResponseEntity.status(401).body(
                    "acest user nu are privilegii de adaugare de taguri"
            );
        }
    }

    public void automaticallyAddTags(User user) {
        Student student = user.getStudent();
        if (student != null) {
            String year = student.getYear().toString();
            String facultyGroup = student.getFacultyGroup();
            String semian = year + facultyGroup.charAt(0);

            Long tagAnId = tagRepository.findByNameAndType(year, TagType.AN).getId();
            Long tagSemianId = tagRepository.findByNameAndType(semian, TagType.SEMIAN).getId();
            Long tagGrupaId = tagRepository.findByNameAndType(year + facultyGroup, TagType.GRUPA).getId();

            userTagManagerRepository.addTagToUser(user.getId(), tagAnId);
            userTagManagerRepository.addTagToUser(user.getId(), tagSemianId);
            userTagManagerRepository.addTagToUser(user.getId(), tagGrupaId);


            List<Enrollment> enrollments = enrollmentRepository.findByIdIdStud(student.getId());
            for (Enrollment e : enrollments) {
                Long courseId = e.getId().getIdCourse();
                String courseTitle =  courseRepository.findById(courseId).stream().findFirst().get().getTitle().trim().toUpperCase();
                System.out.println(courseTitle);
                Tag t = tagRepository.findByNameAndType(courseTitle, TagType.MATERIE);

                if (t != null) {
                    System.out.println("tagul nu e null");
                    userTagManagerRepository.addTagToUser(user.getId(), t.getId());
                }
            }
        }

    }
}
/*
Set<TagDTO> tagDTOs = user.getTags().stream()
                .map(tag -> new TagDTO(tag.getName(), tag.getType()))
                .collect(Collectors.toSet());
 */