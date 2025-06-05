package com.fiiconnect.api.didactic.repositories;

import com.fiiconnect.api.didactic.models.StudCourseCompositeKey;
import com.fiiconnect.api.didactic.models.TransferRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TransferRequestRepository extends JpaRepository<TransferRequest, StudCourseCompositeKey> {

    @Query("""
    SELECT tr
    FROM TransferRequest tr
    JOIN Course c ON tr.id.idCourse = c.id
    JOIN Teaching t ON t.id.idCourse = c.id
    WHERE t.id.idProf = :idProf
""")
    List<TransferRequest> findAllByIdProf(Long idProf);
}
