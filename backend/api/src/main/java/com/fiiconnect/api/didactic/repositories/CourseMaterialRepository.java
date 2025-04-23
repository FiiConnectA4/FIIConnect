package com.fiiconnect.api.didactic.repositories;

import com.fiiconnect.api.didactic.models.CourseMaterial;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CourseMaterialRepository extends JpaRepository<CourseMaterial, Long> {
    List<CourseMaterial> findByIdCourse(Long idCourse);
}
