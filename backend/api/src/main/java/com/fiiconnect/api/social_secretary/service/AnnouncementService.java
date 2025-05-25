package com.fiiconnect.api.social_secretary.service;

import com.fiiconnect.api.auth_userMgmt.dtos.PersonInfoDTO;
import com.fiiconnect.api.social_secretary.DTO.AnnouncementDTO;
import com.fiiconnect.api.social_secretary.DTO.TagDTO;
import com.fiiconnect.api.social_secretary.classes.Announcement;
import com.fiiconnect.api.social_secretary.classes.Tag;
import com.fiiconnect.api.social_secretary.repository.AnnouncementRepository;
import com.fiiconnect.api.social_secretary.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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
    private TagService tagService;

   // @Autowired
   // private UserLogatService userLogatService;

   // @Autowired
   // private UserService2 userService;

    // Obține toate anunțurile din baza de date
    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAllOrderById();
    }

    // Salvează un nou anunț în baza de date
    public Announcement saveAnnouncement(AnnouncementDTO announcementDTO) {
        Set<TagDTO> tagsRequest = announcementDTO.getTags();
        Set<Tag> tags = new HashSet<>();

        // Validarea și procesarea tag-urilor
        for (TagDTO t : tagsRequest) {
            Tag existingTag = tagService.findByNameAndType(t.getName(), t.getType());
            if (existingTag == null) {
                System.out.println("Tag invalid: " + t.getName());
                return null;
            }

            tags.add(existingTag);
        }

        PersonInfoDTO user_request = announcementDTO.getAuthor();

        if(!user_request.role().equals("role_student")) {


            // Setarea datei publicării
            LocalDate today = LocalDate.now();

            // Crearea și salvarea anunțului
            Announcement announcement = new Announcement(
                    announcementDTO.getTitle(),
                    announcementDTO.getMessage(),
                    user_request.userId(),
                    tags,
                    today
            );
        return announcementRepository.save(announcement);
    }
        System.out.println("Nu s-a putut salva anunutul");
        return null;

        }

    // Obține un anunț specific după ID
    public Announcement getAnnouncementById(Long id) {
        return announcementRepository.findById(id).orElse(null);
    }

    // Șterge un anunț după ID
    public void deleteAnnouncement(Long id, PersonInfoDTO personInfoDTO) {

        Announcement existingAnnouncement = announcementRepository.findById(id).orElse(null);

        if (existingAnnouncement == null) {
            System.out.println("Anunțul nu există.");
        }
        else if (!personInfoDTO.userId().equals(existingAnnouncement.getAuthor())){
            System.out.println("User-ul nu are dreptul de a modifica anuntul.");
        }
        else
        announcementRepository.deleteById(id);
    }

    public Announcement updateAnnouncement(Long id, AnnouncementDTO updatedAnnouncement) {

        Announcement currentAnnouncement = announcementRepository.findById(id).orElse(null);

        PersonInfoDTO user_request = updatedAnnouncement.getAuthor();

        if (currentAnnouncement == null) {
            System.out.println("Anunțul nu există.");
            return null;
        }

        if (!user_request.userId().equals(currentAnnouncement.getAuthor())){
            System.out.println("User-ul nu are dreptul de a modifica anuntul.");
            return null;
        }


        currentAnnouncement.setAuthor(user_request.userId());
        currentAnnouncement.setMessage(updatedAnnouncement.getMessage());
        currentAnnouncement.setTitle(updatedAnnouncement.getTitle());
        currentAnnouncement.setPublishedDate(updatedAnnouncement.getPublishedDate());

        Set<TagDTO> tagRequest = updatedAnnouncement.getTags();
        Set<Tag> managedTags = new HashSet<>();

        for (TagDTO tag : tagRequest) {
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

    public List<Long> getTagsIdsFromAnnouncementId(Long idAnnouncement) {
        return announcementRepository.getTagsIdsFromAnnouncementId(idAnnouncement);
    }

    public String getAuthorUserName(Long idAnnouncement) {
        return announcementRepository.getAuthorUserName(idAnnouncement);
    }
}