package com.fiiconnect.api.didactic.repositories;

import com.fiiconnect.api.didactic.models.Feedback;
import com.fiiconnect.api.didactic.models.FeedbackCompositeKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FeedbackRepository extends JpaRepository<Feedback, FeedbackCompositeKey> {
    List<Feedback> findAllByIdIdStud(Long idStud);
    List<Feedback> findAllByIdIdProf(Long idProf);
    void deleteAllByIdIdStud(Long idStud);
    void deleteAllByIdIdProf(Long idStud);
}
