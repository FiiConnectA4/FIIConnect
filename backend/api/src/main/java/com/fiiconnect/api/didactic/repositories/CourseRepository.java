package com.fiiconnect.api.didactic.repositories;

import com.fiiconnect.api.didactic.models.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseRepository extends JpaRepository<Course, Long> {}
