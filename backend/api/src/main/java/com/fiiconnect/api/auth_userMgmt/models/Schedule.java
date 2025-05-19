package com.fiiconnect.api.auth_userMgmt.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@Table(name = "schedules")
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "schedule_seq")
    @SequenceGenerator(name = "schedule_seq", sequenceName = "schedule_seq", allocationSize = 1)
    private Long id;

    @Column(name = "schedule_date")
    private LocalDate date;

    private String activity;

    private boolean updated = false;
}
