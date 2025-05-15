package com.fiiconnect.api.didactic.repositories;

import com.fiiconnect.api.didactic.models.Teaching;
import com.fiiconnect.api.didactic.models.TeachingCompositeKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeachingRepository extends JpaRepository<Teaching, TeachingCompositeKey> {
    List<Teaching> findByIdIdCourse(Long idCourse);
    List<Teaching> findByIdIdProf(Long idProf);
}
