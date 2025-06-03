package com.fiiconnect.api.management_resurse.models;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

public class TimeSlot {
    private LocalTime start;
    private LocalTime end;

    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    public TimeSlot(String start, String end) {
        this.start = LocalTime.parse(start, FORMATTER);
        this.end = LocalTime.parse(end, FORMATTER);
    }

    public TimeSlot(LocalTime start, LocalTime end) {
        this.start = start;
        this.end = end;
    }

    public static List<TimeSlot> generateDefaultSlots() {
        List<TimeSlot> slots = new ArrayList<>();
        LocalTime ora = LocalTime.of(8, 0); // ora de start a zilei
        LocalTime sfarsit = LocalTime.of(20, 0); // ora finală a zilei

        while (ora.isBefore(sfarsit)) {
            LocalTime next = ora.plusHours(1);
            slots.add(new TimeSlot(ora, next));
            ora = next;
        }

        return slots;
    }

    public static List<TimeSlot> excludeSlots(List<TimeSlot> toate, List<TimeSlot> ocupate) {
        List<TimeSlot> libere = new ArrayList<>();

        for (TimeSlot slot : toate) {
            boolean suprapus = false;
            for (TimeSlot ocupat : ocupate) {
                if (slot.overlapsWith(ocupat)) {
                    suprapus = true;
                    break;
                }
            }
            if (!suprapus) {
                libere.add(slot);
            }
        }

        return libere;
    }

    public boolean overlapsWith(TimeSlot other) {
        return this.start.isBefore(other.end) && other.start.isBefore(this.end);
    }

    @Override
    public String toString() {
        return start.format(FORMATTER) + " - " + end.format(FORMATTER);
    }

    // Getters (opțional, dacă vrei să expui în JSON)
    public String getStart() {
        return start.format(FORMATTER);
    }

    public String getEnd() {
        return end.format(FORMATTER);
    }
}