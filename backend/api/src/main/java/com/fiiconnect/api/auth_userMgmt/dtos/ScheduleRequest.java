package com.fiiconnect.api.auth_userMgmt.dtos;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ScheduleRequest {
    private LocalDate date;
    private String activity;
    private Long userId;
}
