package com.fiiconnect.api.didactic.services;

import com.fiiconnect.api.didactic.exceptions.StudentNotFoundException;
import com.fiiconnect.api.didactic.models.Course;
import com.fiiconnect.api.didactic.models.Grade;
import com.fiiconnect.api.didactic.models.Student;
import com.fiiconnect.api.didactic.repositories.CourseRepository;
import com.fiiconnect.api.didactic.repositories.GradeRepository;
import com.fiiconnect.api.didactic.repositories.StudentRepository;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;

@Service
public class GradeService {
    private final GradeRepository repository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    public GradeService(GradeRepository repository, StudentRepository studentRepository, CourseRepository courseRepository ) {
        this.repository = repository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
    }

    public List<Grade> getCourseGrades(Long idCourse)
    {
        return repository.findByIdIdCourse(idCourse);
    }

    public List<Grade> getStudentGrades(Long idStud)
    {
        return repository.findByIdIdStud(idStud);
    }

    public void attachStudent(Grade grade)
    {
        Long idStud = grade.getId().getIdStud();
        Student student = studentRepository.findById(idStud).orElseThrow(() -> new StudentNotFoundException(idStud));
        grade.setStudent(student);
    }

    public byte[] generateStudentGradesPdf(Student student, Integer year, Integer semester) {
        // Add null check for student
        if (student == null) {
            throw new IllegalArgumentException("Student cannot be null");
        }

        List<Grade> grades = repository.findByIdIdStud(student.getId());

        // Handle null grades list
        if (grades == null) {
            grades = new ArrayList<>();
        }

        List<Course> allCourses = courseRepository.findAll();

        if (allCourses == null) {
            allCourses = new ArrayList<>();
        }

        Map<Long, Grade> gradeMap = grades.stream()
                .filter(Objects::nonNull) //  null grades
                .filter(g -> g.getId() != null && g.getId().getIdCourse() != null) // null IDs
                .collect(Collectors.toMap(
                        g -> g.getId().getIdCourse(),
                        g -> g,
                        (existing, replacement) -> existing // duplicate keys
                ));

        List<Course> filteredCourses = allCourses.stream()
                .filter(Objects::nonNull)
                .filter(course -> (year == null || Objects.equals(course.getYear(), year)) &&
                        (semester == null || Objects.equals(course.getSemester(), semester)))
                .collect(Collectors.toList());

        Map<Course, Double> courseGrades = new LinkedHashMap<>();
        for (Course course : filteredCourses) {
            if (course != null && course.getId() != null) {
                Grade grade = gradeMap.get(course.getId());
                double gradeValue = (grade != null && grade.getValue() != null) ? grade.getValue() : 0.0;
                courseGrades.put(course, gradeValue);
            }
        }

        return generatePdf(student, courseGrades);
    }

    private byte[] generatePdf(Student student, Map<Course, Double> courseGrades) {
        try (ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, output);

            document.open();

            String studentName = (student != null && student.getFirstName()  != null) ?
                    student.getFirstName() + student.getLastName() : "Unknown Student";
            document.add(new Paragraph("Grades Report for " + studentName));
            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(4);
            table.setWidthPercentage(100);

            PdfPCell headerCell;
            String[] headers = {"Course ID", "Course Title", "Year", "Grade"};

            for (String header : headers) {
                headerCell = new PdfPCell(new Phrase(header));
                headerCell.setBackgroundColor(BaseColor.LIGHT_GRAY);
                headerCell.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(headerCell);
            }

            for (Map.Entry<Course, Double> entry : courseGrades.entrySet()) {
                Course course = entry.getKey();
                Double grade = entry.getValue();

                if (course != null) {
                    table.addCell(course.getId() != null ? String.valueOf(course.getId()) : "N/A");

                    table.addCell(course.getTitle() != null ? course.getTitle() : "N/A");

                    table.addCell(course.getYear() != null ? String.valueOf(course.getYear()) : "N/A");

                    table.addCell(grade != null ? String.valueOf(grade) : "0.0");
                }
            }

            document.add(table);
            document.close();

            return output.toByteArray();
        } catch (DocumentException e) {
            throw new RuntimeException("Error creating PDF document: " + e.getMessage(), e);
        } catch (IOException e) {
            throw new RuntimeException("Error writing PDF to output stream: " + e.getMessage(), e);
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error generating PDF: " + e.getMessage(), e);
        }
    }


}
