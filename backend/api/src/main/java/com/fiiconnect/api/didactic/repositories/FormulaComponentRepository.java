package com.fiiconnect.api.didactic.repositories;

import com.fiiconnect.api.didactic.models.FormulaComponent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FormulaComponentRepository extends JpaRepository<FormulaComponent, Long> {
    List<FormulaComponent> findByIdFormula(Long formulaId);

    @Query("select c.id from Course c where c.id = (select f.idCourse from Formula f where f.id = (select comp.idFormula from FormulaComponent comp where comp.id = ?1))")
    Long findCourseId(Long idComponent);
}