package com.fiiconnect.api.didactic.services;

import com.fiiconnect.api.didactic.models.*;
import com.fiiconnect.api.didactic.repositories.*;
import com.fiiconnect.api.didactic.exceptions.CourseNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {
    @Autowired
    private final CourseRepository courseRepository;
    private final CourseMaterialRepository materialRepository;
    private final TeachingRepository teachingRepo;
    private final TeachingService teachingService;
    private final EnrollmentService enrollmentService;
    private final GradeService gradeService;
    private final SftpService sftpService;

    public CourseService(CourseRepository courseRepository, CourseMaterialRepository materialRepository, TeachingRepository teachingRepo, TeachingService teachingService, EnrollmentService enrollmentService, GradeService gradeService, SftpService sftpService) {
        this.courseRepository = courseRepository;
        this.materialRepository = materialRepository;
        this.teachingRepo = teachingRepo;
        this.teachingService = teachingService;
        this.gradeService = gradeService;
        this.enrollmentService = enrollmentService;
        this.sftpService = sftpService;
    }

    public void addCourse(Course course){
        courseRepository.save(course);
    }

    public void deleteCourse(Long courseId){
        courseRepository.deleteById(courseId);
    }
    // probably will return List<String>
    public void viewCourseDetails(Long courseId){
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new CourseNotFoundException(courseId));
        // logic for course details
    }

    public void editCourseDetails(Long courseId, String title, String description, String imageUrl){
        Course course = courseRepository.findById(courseId).orElseThrow(() -> new CourseNotFoundException(courseId));
        course.setTitle(title);
        // logic for changing course description and image
    }

    public List<Course> viewAllCourses(){
        return courseRepository.findAll();
    }

    // available courses depending on year and semester
    public List<Course> viewAllCoursesAvailable(int year, int semester){
        return courseRepository.findAll().stream().filter(c1 -> c1.getSemester() == semester)
                .filter(c1 -> c1.getYear() == year).collect(Collectors.toList());
    }

    // we do not have the implementation of the DisciplineSheet class yet
    // should return DisciplineSheet
    public void viewDisciplineSheet(Long courseId){
        Course course = courseRepository.findById(courseId).
                orElseThrow(() -> new CourseNotFoundException(courseId));
        // logic for viewing the discipline sheet
    }

    // we do not have the implementation of the Announcement class yet
    // should return List<Announcement>
    public void viewCourseAnnouncements(Long courseId){
        Course course = courseRepository.findById(courseId).
                orElseThrow(() -> new CourseNotFoundException(courseId));
        // logic..
    }

    // we do not have the implementation of either of them yet
    // should return the uri of the timetable of the specified course or an instance of TimeTable class
    public void viewCourseTimeTable(Long courseId){
        Course course = courseRepository.findById(courseId).
                orElseThrow(() -> new CourseNotFoundException(courseId));
        //  logic..
    }

    public void attachMaterials(Course course)
    {
        List<CourseMaterial> materials = materialRepository.findByIdCourse(course.getId());
        course.setMaterials(materials);
    }

    public void attachProfessors(Course course)
    {
        List<Teaching> professors = teachingRepo.findByIdIdCourse(course.getId());
        professors.forEach(teachingService::attachProfessor);
        course.setProfessors(professors);
    }

    public void attachEnrollments(Course course)
    {
        List<Enrollment> enrollments = enrollmentService.getCourseEnrollments(course.getId());
        enrollments.forEach(enrollmentService::attachStudent);
        course.setEnrollments(enrollments);
    }

    public void attachGrades(Course course)
    {
        List<Grade> grades = gradeService.getCourseGrades(course.getId());
        grades.forEach(gradeService::attachStudent);
        course.setGrades(grades);
    }

    public void attachDescription(Course course)
    {
        File descriptionFile;
        try
        {
            descriptionFile = sftpService.downloadFile("faculty_files/didactic/course-" + course.getId() + "/description.txt", "didactic/course-" + course.getId() + "/description.txt");
        }
        catch (IOException e) {
            if(e instanceof FileNotFoundException)
                course.setDescription("");
            else
                throw new RuntimeException(e);
            return;
        }

        try(FileInputStream input = new FileInputStream(descriptionFile))
        {
            String description = new String(input.readAllBytes());
            course.setDescription(description);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public void attachIcon(Course course){
        var sftp = sftpService.getSftpRemoteFileTemplate();
        var remoteFilePath = "faculty_files/didactic/course-" + course.getId() + "/icon.png";
            sftp.execute(session -> {
                if (!session.exists(remoteFilePath)) {
                    course.setIcon_url("faculty_files/didactic/default_course_icon.png");
                } else course.setIcon_url("didactic/course/" + course.getId() + "/icon.png");
                return null;
            });
    }

    public void saveDescription(Long idCourse, String description)
    {
        if(courseRepository.findById(idCourse).isEmpty())
        {
            throw new CourseNotFoundException(idCourse);
        }

        MockMultipartFile descriptionFile = new MockMultipartFile("description.txt", "description.txt", null, description.getBytes());
        try {
            sftpService.uploadFile(descriptionFile, "faculty_files/didactic/course-" + idCourse + "/");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
