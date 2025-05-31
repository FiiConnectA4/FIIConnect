package com.fiiconnect.api.auth_userMgmt.controllers;

import com.fiiconnect.api.auth_userMgmt.dtos.authDTO.UnassignedPersonDTO;
import com.fiiconnect.api.auth_userMgmt.dtos.personDTO.PersonInfoDTO;
import com.fiiconnect.api.auth_userMgmt.dtos.personDTO.PersonRoleDTO;
import com.fiiconnect.api.auth_userMgmt.dtos.personDTO.ProfessorDTO;
import com.fiiconnect.api.auth_userMgmt.dtos.personDTO.StudentDTO;
import com.fiiconnect.api.auth_userMgmt.exceptions.UserNotFoundException;
import com.fiiconnect.api.auth_userMgmt.models.Role;
import com.fiiconnect.api.auth_userMgmt.models.User;
import com.fiiconnect.api.auth_userMgmt.repositories.UserRepository;
import com.fiiconnect.api.didactic.models.Professor;
import com.fiiconnect.api.didactic.models.Student;
import com.fiiconnect.api.didactic.repositories.ProfessorRepository;
import com.fiiconnect.api.didactic.repositories.StudentRepository;
import com.fiiconnect.api.social_secretary.DTO.TagDTO;
import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/person")
@RequiredArgsConstructor
public class PersonController {

    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final ProfessorRepository professorRepository;

    /**
     * [GET] /person/get-all
     * Returnează toți utilizatorii care au asociat rol de student sau profesor.
     * Acces: doar ADMIN.
     */
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
                        role      = "PROFESSOR";
                    }

                    Set<TagDTO> tags = Optional.ofNullable(u.getTags())
                            .orElse(Collections.emptySet())
                            .stream()
                            .map(tag -> new TagDTO(tag.getId(), tag.getName(), tag.getType()))
                            .collect(Collectors.toSet());

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

    /**
     * [GET] /person/unassigned
     * Returnează lista studenților și profesorilor care încă nu au fost alocați unui cont de utilizator.
     * Acces: doar ADMIN.
     */
    @GetMapping("/unassigned")
    @RolesAllowed("ROLE_ADMIN")
    public ResponseEntity<List<UnassignedPersonDTO>> getUnassignedPersons() {
        // Extragem ID-urile tuturor studenților și profesorilor deja asociați unui user
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

        // Obținem toți studenții din repository
        List<Student> allStudents = Optional.ofNullable(studentRepository.findAll())
                .orElseThrow(() -> new RuntimeException("Student repository returned null"));
        // Filtrăm studenții care nu sunt luați deja
        List<UnassignedPersonDTO> unassignedStudents = allStudents.stream()
                .filter(s -> !studentIdsTaken.contains(s.getId()))
                .map(s -> new UnassignedPersonDTO(
                        s.getId(),
                        s.getFirstName(),
                        s.getLastName(),
                        "STUDENT"
                ))
                .collect(Collectors.toList());

        // Obținem toți profesorii din repository
        List<Professor> allProfessors = Optional.ofNullable(professorRepository.findAll())
                .orElseThrow(() -> new RuntimeException("Professor repository returned null"));
        // Filtrăm profesorii care nu sunt luați deja
        List<UnassignedPersonDTO> unassignedProfessors = allProfessors.stream()
                .filter(p -> !professorIdsTaken.contains(p.getId()))
                .map(p -> new UnassignedPersonDTO(
                        p.getId(),
                        p.getFirstName(),
                        p.getLastName(),
                        "PROFESSOR"
                ))
                .collect(Collectors.toList());

        // Concatenăm listele și returnăm
        List<UnassignedPersonDTO> result = new ArrayList<>();
        result.addAll(unassignedStudents);
        result.addAll(unassignedProfessors);

        return ResponseEntity.ok(result);
    }

    /**
     * [GET] /person/student/{userId}
     * Returnează informațiile despre studentul asociat unui anumit user.
     * Acces: oricine autentificat.
     * Dacă user-ul nu există sau nu are student asociat, aruncă UserNotFoundException (→ 404).
     */
    @GetMapping("/student/{userId}")
    public ResponseEntity<StudentDTO> getStudentInfo(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User cu ID-ul " + userId + " nu există"));

        if (user.getStudent() == null) {
            throw new UserNotFoundException("User-ul cu ID-ul " + userId + " nu are rol de student");
        }

        Student student = studentRepository.findById(user.getStudent().getId())
                .orElseThrow(() -> new UserNotFoundException(
                        "Student asociat pentru user-ul cu ID-ul " + userId + " nu a fost găsit"));

        StudentDTO dto = new StudentDTO(
                student.getId(),
                student.getCnp(),
                student.getRegNumber(),
                student.getFirstName(),
                student.getLastName(),
                student.getYear(),
                student.getFacultyGroup()
        );
        return ResponseEntity.ok(dto);
    }

    /**
     * [GET] /person/professor/{userId}
     * Returnează informațiile despre profesorul asociat unui anumit user.
     * Acces: oricine autentificat.
     * Dacă user-ul nu există sau nu are profesor asociat, aruncă UserNotFoundException (→ 404).
     */
    @GetMapping("/professor/{userId}")
    public ResponseEntity<ProfessorDTO> getProfessorInfo(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User cu ID-ul " + userId + " nu există"));

        if (user.getProfessor() == null) {
            throw new UserNotFoundException("User-ul cu ID-ul " + userId + " nu are rol de profesor");
        }

        Professor professor = Optional.ofNullable(user.getProfessor())
                .orElseThrow(() -> new UserNotFoundException(
                        "Profesor asociat pentru user-ul cu ID-ul " + userId + " nu a fost găsit"
                ));

        ProfessorDTO dto = new ProfessorDTO(
                professor.getId(),
                professor.getCnp(),
                professor.getFirstName(),
                professor.getLastName(),
                professor.getRank()
        );
        return ResponseEntity.ok(dto);
    }

    /**
     * [GET] /person/me
     * Returnează informațiile despre utilizatorul curent autentificat (username + detalii profil).
     * Acces: oricine autentificat.
     * Dacă user-ul nu există sau contul e inactiv, aruncă excepție.
     */
    @GetMapping("/me")
    public ResponseEntity<PersonInfoDTO> getCurrentUserInfo() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) {
            throw new UserNotFoundException("Neautentificat.");
        }

        String username = auth.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException("User-ul '" + username + "' nu există"));

        if (!user.isActive()) {
            throw new UserNotFoundException("Contul este inactiv pentru user-ul: " + username);
        }

        // Extragem primul rol
        String role = user.getRoles().stream()
                .findFirst()
                .map(Role::getRoleName)
                .orElse("UNKNOWN");

        StudentDTO studentDTO = null;
        if (user.getStudent() != null) {
            Student s = user.getStudent();
            studentDTO = new StudentDTO(
                    s.getId(),
                    s.getCnp(),
                    s.getRegNumber(),
                    s.getFirstName(),
                    s.getLastName(),
                    s.getYear(),
                    s.getFacultyGroup()
            );
        }

        ProfessorDTO profDTO = null;
        if (user.getProfessor() != null) {
            Professor p = user.getProfessor();
            profDTO = new ProfessorDTO(
                    p.getId(),
                    p.getCnp(),
                    p.getFirstName(),
                    p.getLastName(),
                    p.getRank()
            );
        }

        Set<TagDTO> tagDTOs = Optional.ofNullable(user.getTags())
                .orElse(Collections.emptySet())
                .stream()
                .map(tag -> new TagDTO(tag.getId(), tag.getName(), tag.getType()))
                .collect(Collectors.toSet());

        PersonInfoDTO dto = new PersonInfoDTO(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                role,
                studentDTO,
                profDTO,
                tagDTOs
        );
        return ResponseEntity.ok(dto);
    }
}
