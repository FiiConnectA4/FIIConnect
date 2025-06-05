package com.fiiconnect.api.didactic.repositories;

import com.fiiconnect.api.didactic.models.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProfessorRepository extends JpaRepository<Professor, Long> {
    boolean existsByCnp(String cnp);

    @Query("""
        SELECT p.id as professorId, 
               p.firstName || ' ' || p.lastName as professorName, 
               AVG((f.teachingGrade + f.materialsGrade + f.evaluationGrade)/3) as averageFeedbackScore,
               COUNT(f) as feedbackCount
        FROM Professor p
        JOIN Feedback f ON f.id.idProf = p.id
        GROUP BY p.id, p.firstName, p.lastName
        ORDER BY averageFeedbackScore DESC
    """)
    List<Object[]> findTopProfessorsByAverageFeedback();
}
