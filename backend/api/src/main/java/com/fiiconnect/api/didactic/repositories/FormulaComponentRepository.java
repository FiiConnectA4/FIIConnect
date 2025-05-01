package com.fiiconnect.api.didactic.repositories;

import com.fiiconnect.api.didactic.models.FormulaComponent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FormulaComponentRepository extends JpaRepository<FormulaComponent, Long> {
    List<FormulaComponent> findByFormulaId(Long formulaId);
}