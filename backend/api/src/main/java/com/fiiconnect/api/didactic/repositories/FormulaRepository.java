package com.fiiconnect.api.didactic.repositories;

import com.fiiconnect.api.didactic.models.Formula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface FormulaRepository extends JpaRepository<Formula, Long> {
    Optional<Formula> findByIdCourse(Long idCourse);

    @Query("select c.id from Course c where c.id = (select f.idCourse from Formula f where f.id = ?1)")
    Long findCourseId(Long idFormula);
}