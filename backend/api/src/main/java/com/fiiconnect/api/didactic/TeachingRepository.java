package com.fiiconnect.api.didactic;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TeachingRepository extends JpaRepository<Teaching, TeachingCompositeKey> {
    List<Teaching> findByIdIdCourse(Long idCourse);
    List<Teaching> findByIdIdProf(Long idProf);
}
