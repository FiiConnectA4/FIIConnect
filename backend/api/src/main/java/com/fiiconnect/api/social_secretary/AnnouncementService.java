package com.fiiconnect.api.social_secretary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;

@Service
public class AnnouncementService {
    @Autowired
    private AnnouncementRepository announcementRepository;

    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAll();
    }

    public Announcement saveAnnouncement(Announcement announcement) {
        return announcementRepository.save(announcement);
    }
    /*public Announcement getAnnouncement(String Title){
        return anouncs.stream().filter(a ->a.getTitle().equals(Title))
                .findFirst().orElse(new Announcement());
    }*/

}