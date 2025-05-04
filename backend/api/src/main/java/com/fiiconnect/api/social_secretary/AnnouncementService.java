package com.fiiconnect.api.social_secretary;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class AnnouncementService {

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private UserLogatService userLogatService;

    @Autowired
    private UserService userService;

    // Obține toate anunțurile din baza de date
    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAllOrderById();
    }

    // Salvează un nou anunț în baza de date
    public Announcement saveAnnouncement(Announcement announcement) {
        return announcementRepository.save(announcement);
    }

    // Obține un anunț specific după ID
    public Announcement getAnnouncementById(Long id) {
        return announcementRepository.findById(id).orElse(null);
    }

    // Șterge un anunț după ID
    public void deleteAnnouncement(Long id) {
        announcementRepository.deleteById(id);
    }

    public Announcement updateAnnouncement(Long id, CreateAnnouncementRequest updatedAnnouncement) {
        Announcement currentAnnouncement = announcementRepository.findById(id).orElse(null);
        if(currentAnnouncement == null){
            System.out.println("id-ul nu exista");
            return null;
        }
        User_Anunturi user;
        try {
            user = userService.getUserById(userLogatService.getUserLogat().getId());
            if (user == null) {
                System.out.println("User-ul nu este logat");
                return null;
            }

            if(!user.getType().equals("Profesor") && !user.getType().equals("Secretar")){
                System.out.println("User-ul nu are privilegii");
                return null;
            }
        }catch(NullPointerException ex){
            System.out.println("User-ul nu este logat");
            return null;
        }

        currentAnnouncement.setAuthor(user);
        currentAnnouncement.setMessage(updatedAnnouncement.getMessage());
        currentAnnouncement.setTitle(updatedAnnouncement.getTitle());
        currentAnnouncement.setPublishedDate(updatedAnnouncement.getPublishedDate());

        Set<TagRequest> tagRequest = updatedAnnouncement.getTags();
        Set<Tag> managedTags = new HashSet<>();

        for (TagRequest tag : tagRequest) {
            Tag managedTag = tagRepository.findByNameAndType(tag.getName(),tag.getType());
            if (managedTag != null) {
                managedTags.add(managedTag);
            }
        }
        currentAnnouncement.getTags().clear();
        currentAnnouncement.getTags().addAll(managedTags);
        return announcementRepository.save(currentAnnouncement);
    }

    public List<Long> getAllAnnouncementsId(Long tagId) {
        return announcementRepository.getAllAnnouncementsId(tagId);
    }

    public Set<Announcement> getAnnouncementsByUserId(Long id) {
        return announcementRepository.getAnnouncementsByUserId(id);
    }
}