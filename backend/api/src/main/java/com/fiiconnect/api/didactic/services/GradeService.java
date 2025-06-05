package com.fiiconnect.api.didactic.services;

import com.fiiconnect.api.didactic.exceptions.StudentNotFoundException;
import com.fiiconnect.api.didactic.models.*;
import com.fiiconnect.api.didactic.repositories.*;
import org.springframework.stereotype.Service;

import java.io.*;
import java.time.LocalDate;
import java.util.*;
import java.util.List;
import java.util.stream.Collectors;
import java.io.ByteArrayOutputStream;
import java.util.*;
import java.util.stream.Collectors;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import org.springframework.web.multipart.MultipartFile;

@Service
public class GradeService {
    private final GradeRepository repository;
    private final StudentRepository studentRepository;
    private final CourseRepository courseRepository;
    private final FormulaRepository formulaRepository;
    private final ComponentScoreRepository componentScoreRepository;
    private final String FINAL_GRADE = "NOTA";
    private final GradeRepository gradeRepository;

    public GradeService(GradeRepository repository, StudentRepository studentRepository,
                        CourseRepository courseRepository, FormulaRepository formulaRepository, ComponentScoreRepository componentScoreRepository, GradeRepository gradeRepository) {
        this.repository = repository;
        this.studentRepository = studentRepository;
        this.courseRepository = courseRepository;
        this.formulaRepository = formulaRepository;
        this.componentScoreRepository = componentScoreRepository;
        this.gradeRepository = gradeRepository;
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

    public void updateGradesFromCsv(MultipartFile file, Long courseId) throws IOException {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()))) {
            String line;
            int lineNumber = 0;

            while ((line = reader.readLine()) != null) {
                lineNumber++;
                if (line.trim().isEmpty()) continue; // skip empty lines

                String[] tokens = line.split(",");

                if (tokens.length != 3) {
                    throw new IllegalArgumentException("Invalid format at line " + lineNumber);
                }

                String nrMatricol = tokens[0].trim();
                String componentName = (tokens[1].trim()).toUpperCase();
                String gradeValueStr = tokens[2].trim();

                // find list of the formula componenents
                Optional<Formula> formulaOpt = formulaRepository.findByIdCourse(courseId);

                if (formulaOpt.isEmpty()) {
                    throw new IllegalArgumentException("Invalid formula at line " + lineNumber + ": " + courseId );
                }

                // Parse grade value
                Double gradeValue;
                try {
                    gradeValue = Double.parseDouble(gradeValueStr);
                } catch (NumberFormatException e) {
                    throw new IllegalArgumentException("Invalid grade value at line " + lineNumber + ": " + gradeValueStr);
                }

                Optional<Student> studentOpt = studentRepository.findByRegNumber(nrMatricol);
                if (studentOpt.isEmpty()) {
                    throw new IllegalArgumentException("Student not found at line " + lineNumber + ": " + nrMatricol);
                }

                Student student = studentOpt.get();

                List<FormulaComponent> components = formulaOpt.get().getComponents();
                boolean found = false;
                for (FormulaComponent component : components) {
                    String cName = component.getName().toUpperCase();
                    if(component.getName().equals(componentName) && !componentName.trim().equals(FINAL_GRADE)) {
                        found = true;
                        ComponentScoreCompositeKey key = new ComponentScoreCompositeKey(student.getId(), component.getId());
                        ComponentScore componentScore = new ComponentScore(key, gradeValue);
                        componentScoreRepository.save(componentScore);
                    }
                }
                if(!found){
                   if (componentName.equals(FINAL_GRADE)) {
                       found = true;
                       StudCourseCompositeKey key = new StudCourseCompositeKey(student.getId(), courseId);
                       Grade g = new Grade(key, gradeValue, new Date());
                       gradeRepository.save(g);
                   }
                   else{
                       throw new IllegalArgumentException("Invalid formula at line " + lineNumber + ": " + componentName );
                   }
                }
            }
        }
    }

}
