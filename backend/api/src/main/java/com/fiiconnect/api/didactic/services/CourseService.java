package com.fiiconnect.api.didactic.services;

import com.fiiconnect.api.didactic.models.Enrollment;
import com.fiiconnect.api.didactic.repositories.CourseMaterialRepository;
import com.fiiconnect.api.didactic.repositories.CourseRepository;
import com.fiiconnect.api.didactic.repositories.EnrollmentRepository;
import com.fiiconnect.api.didactic.repositories.TeachingRepository;
import com.fiiconnect.api.didactic.exceptions.CourseNotFoundException;
import com.fiiconnect.api.didactic.models.Course;
import com.fiiconnect.api.didactic.models.CourseMaterial;
import com.fiiconnect.api.didactic.models.Teaching;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {
    @Autowired
    private final CourseRepository courseRepository;
    private final CourseMaterialRepository materialRepository;
    private final TeachingRepository teachingRepo;
    private final TeachingService teachingService;
    private final EnrollmentRepository enrollmentRepo;
    private final EnrollmentService enrollmentService;

    public CourseService(CourseRepository courseRepository, CourseMaterialRepository materialRepository, TeachingRepository teachingRepo, TeachingService teachingService, EnrollmentRepository enrollmentRepo, EnrollmentService enrollmentService) {
        this.courseRepository = courseRepository;
        this.materialRepository = materialRepository;
        this.teachingRepo = teachingRepo;
        this.teachingService = teachingService;
        this.enrollmentRepo = enrollmentRepo;
        this.enrollmentService = enrollmentService;
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
        course.setEnrollments(enrollmentService.getCourseEnrollments(course.getId()));
    }
}
