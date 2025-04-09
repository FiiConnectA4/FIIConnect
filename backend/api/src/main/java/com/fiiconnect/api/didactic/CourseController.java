package com.fiiconnect.api.didactic;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
@RestController
public class CourseController {
    private final CourseRepository repository;

    CourseController(CourseRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/didactic/course")
    List<Course> all() {
       return repository.findAll();
    }

    @PostMapping("/didactic/course")
    Course newCourse(@RequestBody Course course) {
        return repository.save(course);
    }

    @GetMapping("/didactic/course/{id}")
    Course findById(@PathVariable("id") Long id) throws CourseNotFoundException {
        return repository.findById(id).orElseThrow(() -> new CourseNotFoundException(id));
    }

    @PutMapping("/didactic/course/{id}")
    Course replaceCourse(@PathVariable("id") Long id, @RequestBody Course newCourse) throws CourseNotFoundException {
        return repository.findById(id)
                .map(course -> {
                    course.setArchived(newCourse.getArchived());
                    course.setCode(newCourse.getCode());
                    course.setCredits(newCourse.getCredits());
                    course.setYear(newCourse.getYear());
                    course.setSemester(newCourse.getSemester());
                    course.setTitle(newCourse.getTitle());
                    return repository.save(course);
                }).orElseGet(() -> repository.save(newCourse));
    }

    @DeleteMapping("/didactic/{id}")
    void deleteCourse(@PathVariable("id") Long id) throws CourseNotFoundException {
        repository.deleteById(id);
    }
}
