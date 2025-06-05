package com.fiiconnect.api.didactic.repositories;

import com.fiiconnect.api.didactic.models.Grade;
import com.fiiconnect.api.didactic.models.StudCourseCompositeKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GradeRepository extends JpaRepository<Grade, StudCourseCompositeKey> {
    List<Grade> findByIdIdStud(Long idStud);
    List<Grade> findByIdIdCourse(Long idCourse);
}
