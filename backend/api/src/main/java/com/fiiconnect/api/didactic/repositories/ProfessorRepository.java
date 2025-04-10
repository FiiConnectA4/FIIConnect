package com.fiiconnect.api.didactic.repositories;

import com.fiiconnect.api.didactic.models.Professor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProfessorRepository extends JpaRepository<Professor, Long> {
}
