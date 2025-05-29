package com.fiiconnect.api.didactic.controllers;

import com.fiiconnect.api.auth_userMgmt.controllers.PersonController;
import com.fiiconnect.api.auth_userMgmt.dtos.PersonInfoDTO;
import com.fiiconnect.api.didactic.exceptions.ProfessorNotFoundException;
import com.fiiconnect.api.didactic.exceptions.UnauthorizedOperationException;
import com.fiiconnect.api.didactic.models.Course;
import com.fiiconnect.api.didactic.models.Grade;
import com.fiiconnect.api.didactic.models.Professor;
import com.fiiconnect.api.didactic.models.Teaching;
import com.fiiconnect.api.didactic.repositories.ProfessorRepository;
import com.fiiconnect.api.didactic.services.CourseService;
import com.fiiconnect.api.didactic.services.ProfessorService;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
public class StatisticsController {
    private final PersonController personController;
    private final ProfessorService professorService;
    private final ProfessorRepository professorRepository;
    private final CourseService courseService;

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @GetMapping("/didactic/statistics/prof/avgGrade")
    public Double getProfessorAverageGrading(@RequestParam Long idProf)
    {
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(person.role().equals("ROLE_PROFESOR") && !idProf.equals(person.professor().id()))
            throw new UnauthorizedOperationException("Professors can only compute statistics about themselves");

        Professor professor = professorRepository.findById(idProf).orElseThrow(() -> new ProfessorNotFoundException(idProf));
        professorService.attachCourses(professor);
        professor.getCourses().forEach(t -> courseService.attachGrades(t.getCourse()));

        Double average = 0.0;
        Long count = 0L;
        for (Teaching teaching : professor.getCourses()) {
            Course course = teaching.getCourse();
            List<Grade> grades = course.getGrades();
            average += grades.stream().mapToDouble(Grade::getValue).sum();
            count += grades.size();
        }

        if(count == 0)
            return null;
        return average/count;
    }
}
