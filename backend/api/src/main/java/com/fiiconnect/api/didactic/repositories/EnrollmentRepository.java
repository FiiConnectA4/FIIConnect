package com.fiiconnect.api.didactic.repositories;

import com.fiiconnect.api.didactic.models.Enrollment;
import com.fiiconnect.api.didactic.models.EnrollmentCompositeKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EnrollmentRepository extends JpaRepository<Enrollment, EnrollmentCompositeKey> {
    List<Enrollment> findByIdIdStud(Long idStud);
    List<Enrollment> findByIdIdCourse(Long idCourse);
}
