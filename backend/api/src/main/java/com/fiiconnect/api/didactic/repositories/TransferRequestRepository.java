package com.fiiconnect.api.didactic.repositories;

import com.fiiconnect.api.didactic.models.StudCourseCompositeKey;
import com.fiiconnect.api.didactic.models.TransferRequest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransferRequestRepository extends JpaRepository<TransferRequest, StudCourseCompositeKey> {
}
