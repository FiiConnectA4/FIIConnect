package com.fiiconnect.api.didactic.controllers;

import com.fiiconnect.api.auth_userMgmt.controllers.PersonController;
import com.fiiconnect.api.auth_userMgmt.dtos.PersonInfoDTO;
import com.fiiconnect.api.didactic.exceptions.ProfessorNotFoundException;
import com.fiiconnect.api.didactic.exceptions.StudentNotFoundException;
import com.fiiconnect.api.didactic.exceptions.UnauthorizedOperationException;
import com.fiiconnect.api.didactic.models.Course;
import com.fiiconnect.api.didactic.models.Grade;
import com.fiiconnect.api.didactic.models.Professor;
import com.fiiconnect.api.didactic.models.Student;
import com.fiiconnect.api.didactic.models.Teaching;
import com.fiiconnect.api.didactic.repositories.ProfessorRepository;
import com.fiiconnect.api.didactic.repositories.StudentRepository;
import com.fiiconnect.api.didactic.services.CourseService;
import com.fiiconnect.api.didactic.services.GradeService;
import com.fiiconnect.api.didactic.services.ProfessorService;
import com.fiiconnect.api.didactic.services.StudentService;
import lombok.AllArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@AllArgsConstructor
public class StatisticsController {
    private final PersonController personController;
    private final ProfessorService professorService;
    private final ProfessorRepository professorRepository;
    private final CourseService courseService;
    private final StudentService studentService;
    private final GradeService gradeService;
    private final StudentRepository studentRepository;

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @GetMapping("/didactic/statistics/prof/avgGrade")
    public Double getProfessorAverageGrading(@RequestParam Long idProf) {
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if (person.role().equals("ROLE_PROFESOR") && !idProf.equals(person.professor().id())) {
            throw new UnauthorizedOperationException("Professors can only compute statistics about themselves");
        }

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

        if (count == 0) {
            return null;
        }
        return average / count;
    }

    @PreAuthorize("hasRole('STUDENT') or hasRole('ADMIN')")
    @GetMapping("/didactic/statistics/grades/distribution/{userID}")
    public List<Map<String, Object>> getStudentGradeDistribution(@PathVariable Long userID, @RequestParam int year, @RequestParam int semester) {
        System.out.println("pula");
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();

        if (person.role().equals("ROLE_STUDENT") && !userID.equals(person.student().id())) {
            throw new UnauthorizedOperationException("Students can only view their own grade distribution");
        }

        List<Grade> grades = gradeService.getStudentGrades(userID);

        Student student = studentRepository.findById(userID).orElseThrow(() -> new StudentNotFoundException(userID));

        studentService.attachGrades(student);

        List<Course> semesterCourses = courseService.viewAllCoursesAvailable(year, semester);
        List<Long> courseIds = semesterCourses.stream().map(Course::getId).toList();
        grades = grades.stream()
                .filter(grade -> courseIds.contains(grade.getId().getIdCourse()))
                .toList();

        int[] gradeRanges = new int[4]; // 0: [0-4], 1: [5-6], 2: [7-8], 3: [9-10]
        int totalGrades = 0;

        for (Grade grade : grades) {
            double value = grade.getValue();
            if (value >= 0 && value <= 4) {
                gradeRanges[0]++;
            } else if (value <= 6) {
                gradeRanges[1]++;
            } else if (value <= 8) {
                gradeRanges[2]++;
            } else if (value <= 10) {
                gradeRanges[3]++;
            }
            totalGrades++;
        }

        List<Map<String, Object>> distribution = new ArrayList<>();
        String[] labels = {"0-4", "5-6", "7-8", "9-10"};
        for (int i = 0; i < gradeRanges.length; i++) {
            Map<String, Object> rangeData = new HashMap<>();
            rangeData.put("range", labels[i]);
            rangeData.put("count", gradeRanges[i]);
            rangeData.put("percentage", totalGrades > 0 ? (gradeRanges[i] * 100.0 / totalGrades) : 0.0);
            distribution.add(rangeData);
        }

        return distribution;
    }
}