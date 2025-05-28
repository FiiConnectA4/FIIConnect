package com.fiiconnect.api.auth_userMgmt.controllers;

import com.fiiconnect.api.auth_userMgmt.models.Schedule;
import com.fiiconnect.api.auth_userMgmt.models.User;
import com.fiiconnect.api.auth_userMgmt.repositories.ScheduleRepository;
import com.fiiconnect.api.auth_userMgmt.repositories.UserRepository;
import com.fiiconnect.api.auth_userMgmt.dtos.ScheduleRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/schedule")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleRepository scheduleRepository;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<String> createSchedule(@RequestBody ScheduleRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Schedule schedule = new Schedule();
        schedule.setDate(request.getDate());
        schedule.setActivity(request.getActivity());
        schedule.setUser(user);

        scheduleRepository.save(schedule);
        return ResponseEntity.ok("Schedule created successfully.");
    }
}
