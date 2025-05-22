package com.fiiconnect.api.didactic.repositories;

import com.fiiconnect.api.didactic.models.Grade;
import com.fiiconnect.api.didactic.models.GradeCompositeKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GradeRepository extends JpaRepository<Grade, GradeCompositeKey> {
    List<Grade> findByIdIdStud(Long idStud);
    List<Grade> findByIdIdCourse(Long idCourse);
}
