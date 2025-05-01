package com.fiiconnect.api.didactic.repositories;

import com.fiiconnect.api.didactic.models.Formula;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FormulaRepository extends JpaRepository<Formula, Long> {
    Optional<Formula> findByIdCourse(Long idCourse);
}