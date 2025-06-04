package com.fiiconnect.api.didactic.repositories;

import com.fiiconnect.api.didactic.models.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Set;

public interface StudentRepository extends JpaRepository<Student, Long> {
    boolean existsByCnp(String cnp);

    @Query("select g.id.idStud from Grade g join Course c on g.id.idCourse = c.id and g.value >= 4.5 group by g.id.idStud having sum(c.credits) >= ?1")
    List<Long> findStudentIdsEligibleForYearAdvance(int necessaryCredits);

    @Modifying(flushAutomatically = true, clearAutomatically = true)
    @Query("update Student s set s.year = s.year + 1 where s.id in ?1")
    void executeYearAdvance(Set<Long> studentIds);
}
