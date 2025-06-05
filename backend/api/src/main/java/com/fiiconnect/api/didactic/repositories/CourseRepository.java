package com.fiiconnect.api.didactic.repositories;

import com.fiiconnect.api.didactic.models.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CourseRepository extends JpaRepository<Course, Long> {

    @Query("select s.facultyGroup from Course c join Enrollment e on c.id = ?1 and c.id = e.id.idCourse join Student s on e.id.idStud = s.id")
    List<String> findGroups(Long idCourse);
}
