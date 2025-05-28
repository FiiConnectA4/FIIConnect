package com.fiiconnect.api.auth_userMgmt.services;

import com.fiiconnect.api.auth_userMgmt.models.Notification;
import com.fiiconnect.api.auth_userMgmt.models.Schedule;
import com.fiiconnect.api.auth_userMgmt.repositories.NotificationRepository;
import com.fiiconnect.api.auth_userMgmt.repositories.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ScheduleNotificationService {

    private final ScheduleRepository scheduleRepository;
    private final NotificationRepository notificationRepository;

    @Scheduled(cron = "0 0 * * * *") // La începutul fiecărei ore
    public void notifyUsersAboutTodaySchedule() {
        LocalDate today = LocalDate.now();
        List<Schedule> schedules = scheduleRepository.findAllByDate(today);

        for (Schedule s : schedules) {
            Notification n = new Notification();
            n.setRecipient(s.getUser());
            n.setTitle("Eveniment programat pentru azi");
            n.setContent("Activitate: " + s.getActivity());
            n.setType("SCHEDULE_REMINDER");
            notificationRepository.save(n);
        }
    }
}
