package com.fiiconnect.api.auth_userMgmt.services;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class ScheduleUpdateService {

    @Scheduled(cron = "0 0 0 * * *")
    public void updateDailySchedule() {
        System.out.println("Execut actualizarea programului pentru ziua curentă");

        // TODO: Adaugă aici logica de actualizare a programului
        // Exemplu: scheduleService.updateScheduleForToday();

        // log.info("Actualizare completă.");
    }
}

