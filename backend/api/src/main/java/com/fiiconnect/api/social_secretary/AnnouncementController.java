package com.fiiconnect.api.social_secretary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/anunturi")
public class AnnouncementController {
    @Autowired
    private AnnouncementService announcementService;

    @GetMapping
    public List<Announcement> getAnnouncements() {
        return announcementService.getAllAnnouncements();
    }

    @PostMapping
    public Announcement createAnnouncement(@RequestBody Announcement announcement) {
        return announcementService.saveAnnouncement(announcement);
    }
}
