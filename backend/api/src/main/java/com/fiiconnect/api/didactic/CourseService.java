package com.fiiconnect.api.didactic;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class CourseService {
    @Autowired
    private final CourseRepository courseRepository;

    public CourseService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
    }

    public void addCourse(Course course){
        courseRepository.save(course);
    }

    public void deleteCourse(Long courseId){
        courseRepository.deleteById(courseId);
    }

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
}
