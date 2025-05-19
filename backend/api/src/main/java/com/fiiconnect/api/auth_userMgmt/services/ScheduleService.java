package com.fiiconnect.api.auth_userMgmt.services;

import com.fiiconnect.api.auth_userMgmt.repositories.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class ScheduleService {

    private final ScheduleRepository scheduleRepo;

    @Scheduled(cron = "0 0 0 * * *")
    public void updateTodaySchedule() {
        LocalDate today = LocalDate.now();
        System.out.println("✅ Actualizez programul pentru data: " + today);

        scheduleRepo.updateScheduleForDate(today);
    }
}
