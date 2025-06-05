package com.fiiconnect.api.auth_userMgmt.controllers;

import com.fiiconnect.api.auth_userMgmt.dtos.*;
import com.fiiconnect.api.auth_userMgmt.models.Role;
import com.fiiconnect.api.auth_userMgmt.models.User;
import com.fiiconnect.api.auth_userMgmt.repositories.UserRepository;
import com.fiiconnect.api.didactic.models.Professor;
import com.fiiconnect.api.didactic.models.Student;
import com.fiiconnect.api.didactic.repositories.ProfessorRepository;
import com.fiiconnect.api.didactic.repositories.StudentRepository;
import com.fiiconnect.api.social_secretary.DTO.TagDTO;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;


import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/person")
public class PersonController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ProfessorRepository professorRepository;

    @GetMapping("/get-all")
    @RolesAllowed("ROLE_ADMIN")
    public ResponseEntity<List<PersonRoleDTO>> getAllPersons() {
        List<User> allUsers = userRepository.findAll();

        List<PersonRoleDTO> result = allUsers.stream()
                .filter(u -> u.getStudent() != null || u.getProfessor() != null)
                .map(u -> {
                    String role, firstName, lastName;

                    if (u.getStudent() != null) {
                        Student s = u.getStudent();
                        firstName = s.getFirstName();
                        lastName  = s.getLastName();
                        role      = "STUDENT";
                    } else {
                        Professor p = u.getProfessor();
                        firstName = p.getFirstName();
                        lastName  = p.getLastName();
                        role      = "PROFESOR";
                    }

                    Set<TagDTO> tags = u.getTags().stream()
                            .map(tag -> new TagDTO(tag.getId(), tag.getName(), tag.getType()))
                            .collect(Collectors.toSet());

                    // <-- pass u.getId() as first arg
                    return new PersonRoleDTO(
                            u.getId(),
                            lastName,
                            firstName,
                            role,
                            tags
                    );
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @GetMapping("/unassigned")
    @RolesAllowed("ROLE_ADMIN")
    public ResponseEntity<List<UnassignedPersonDTO>> getUnassignedPersons() {
        Set<Long> studentIdsTaken = userRepository.findAll().stream()
                .map(User::getStudent)
                .filter(Objects::nonNull)
                .map(Student::getId)
                .collect(Collectors.toSet());

        Set<Long> professorIdsTaken = userRepository.findAll().stream()
                .map(User::getProfessor)
                .filter(Objects::nonNull)
                .map(Professor::getId)
                .collect(Collectors.toSet());

        List<UnassignedPersonDTO> unassignedStudents = studentRepository.findAll().stream()
                .filter(s -> !studentIdsTaken.contains(s.getId()))
                .map(s -> new UnassignedPersonDTO(
                        s.getId(),
                        s.getFirstName(),
                        s.getLastName(),
                        "STUDENT"
                ))
                .toList();

        List<UnassignedPersonDTO> unassignedProfessors = professorRepository.findAll().stream()
                .filter(p -> !professorIdsTaken.contains(p.getId()))
                .map(p -> new UnassignedPersonDTO(
                        p.getId(),
                        p.getFirstName(),
                        p.getLastName(),
                        "PROFESOR"
                ))
                .toList();

        List<UnassignedPersonDTO> result = new ArrayList<>();
        result.addAll(unassignedStudents);
        result.addAll(unassignedProfessors);

        return ResponseEntity.ok(result);
    }


    @GetMapping("/student/{userId}")
    public ResponseEntity<?> getStudentInfo(@PathVariable Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty() || userOpt.get().getStudent() == null) {
            return ResponseEntity.notFound().build();
        }
        Student s = studentRepository.findById(userOpt.get().getStudent().getId()).orElse(null);

        return ResponseEntity.ok(new StudentDTO(
                s.getId(), s.getCnp(), s.getRegNumber(),
                s.getFirstName(), s.getLastName(),
                s.getYear(), s.getFacultyGroup()
        ));
    }

    @GetMapping("/professor/{userId}")
    public ResponseEntity<?> getProfessorInfo(@PathVariable Long userId) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty() || userOpt.get().getProfessor() == null) {
            return ResponseEntity.notFound().build();
        }
        Professor p = userOpt.get().getProfessor();

        return ResponseEntity.ok(new ProfessorDTO(
                p.getId(), p.getCnp(), p.getFirstName(),
                p.getLastName(), p.getRank()
        ));
    }


    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUserInfo() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            return ResponseEntity.status(401).body("Neautentificat.");
        }

        String username = auth.getName();
        Optional<User> userOpt = Optional.ofNullable(userRepository.findByUsername(username));
        if (userOpt.isEmpty()) {
            return ResponseEntity.status(404).body("Utilizator inexistent.");
        }

        User user = userOpt.get();

        if (!user.isActive()) {
            return ResponseEntity.status(403).body("Contul este inactiv.");
        }

        String role = user.getRoles().stream()
                .findFirst()
                .map(Role::getRoleName)
                .orElse("UNKNOWN");

        StudentDTO studentDTO = null;
        if (user.getStudent() != null) {
            Student s = user.getStudent();
            studentDTO = new StudentDTO(s.getId(), s.getCnp(), s.getRegNumber(), s.getFirstName(), s.getLastName(), s.getYear(), s.getFacultyGroup());
        }

        ProfessorDTO profDTO = null;
        if (user.getProfessor() != null) {
            Professor p = user.getProfessor();
            profDTO = new ProfessorDTO(p.getId(), p.getCnp(), p.getFirstName(), p.getLastName(), p.getRank());
        }

        Set<TagDTO> tagDTOs = user.getTags().stream()
                .map(tag -> new TagDTO(tag.getId(), tag.getName(), tag.getType()))
                .collect(Collectors.toSet());

        return ResponseEntity.ok(new PersonInfoDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                role,
                studentDTO,
                profDTO,
                tagDTOs
        ));
    }
}
