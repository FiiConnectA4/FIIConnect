package com.fiiconnect.api.didactic.repositories;

import com.fiiconnect.api.didactic.models.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository extends JpaRepository<Student, Long> {
    boolean existsByCnp(String cnp);
}
