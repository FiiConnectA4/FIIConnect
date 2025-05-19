package com.fiiconnect.api.auth_userMgmt.repositories;

import com.fiiconnect.api.auth_userMgmt.models.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    @Transactional
    @Modifying
    @Query("UPDATE Schedule s SET s.updated = true WHERE s.date = :date")
    void updateScheduleForDate(LocalDate date);
}
