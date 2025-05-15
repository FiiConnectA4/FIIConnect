    package com.fiiconnect.api.social_secretary.service;

    import com.fiiconnect.api.social_secretary.DTO.AnnouncementDTO;
    import com.fiiconnect.api.social_secretary.DTO.TagDTO;
    import com.fiiconnect.api.social_secretary.classes.Announcement;
    import com.fiiconnect.api.social_secretary.classes.Tag;
    import com.fiiconnect.api.social_secretary.classes.User_Anunturi;
    import com.fiiconnect.api.social_secretary.repository.AnnouncementRepository;
    import com.fiiconnect.api.social_secretary.repository.TagRepository;
    import org.springframework.beans.factory.annotation.Autowired;
    import org.springframework.data.domain.Page;
    import org.springframework.data.domain.PageRequest;
    import org.springframework.data.domain.Pageable;
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
        private UserService2 userService;

        public Page<Announcement> getAllAnnouncements(int page, int size) {
            Pageable pageable = PageRequest.of(page, size);
            return announcementRepository.findAllOrderById(pageable);
        }

        public Announcement saveAnnouncement(Announcement announcement) {
            return announcementRepository.save(announcement);
        }

        public Announcement getAnnouncementById(Long id) {
            return announcementRepository.findById(id).orElse(null);
        }

        public void deleteAnnouncement(Long id) {
            announcementRepository.deleteById(id);
        }

        public Announcement updateAnnouncement(Long id, AnnouncementDTO updatedAnnouncement) {
            Announcement currentAnnouncement = announcementRepository.findById(id).orElse(null);
            if (currentAnnouncement == null) {
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

                if (!user.getType().equals("Profesor") && !user.getType().equals("Secretar")) {
                    System.out.println("User-ul nu are privilegii");
                    return null;
                }
            } catch (NullPointerException ex) {
                System.out.println("User-ul nu este logat");
                return null;
            }

            currentAnnouncement.setAuthor(user);
            currentAnnouncement.setMessage(updatedAnnouncement.getMessage());
            currentAnnouncement.setTitle(updatedAnnouncement.getTitle());
            currentAnnouncement.setPublishedDate(updatedAnnouncement.getPublishedDate());

            Set<TagDTO> tagRequest = updatedAnnouncement.getTags();
            Set<Tag> managedTags = new HashSet<>();

            for (TagDTO tag : tagRequest) {
                Tag managedTag = tagRepository.findByNameAndType(tag.getName(), tag.getType());
                if (managedTag != null) {
                    managedTags.add(managedTag);
                }
            }

            currentAnnouncement.getTags().clear();
            currentAnnouncement.getTags().addAll(managedTags);
            return announcementRepository.save(currentAnnouncement);
        }

        public Page<Object[]> getAllAnnouncementsId(Long tagId,int page,int size) {
            Pageable pageable=PageRequest.of(page,size);
            return announcementRepository.getAllAnnouncementsId(tagId,pageable);
        }

        public Page<Announcement> getAnnouncementsByUserId(Long id,int page,int size) {
            Pageable pageable=PageRequest.of(page,size);
            return announcementRepository.getAnnouncementsByUserId(id,pageable);
        }

        public List<Long> getTagsIdsFromAnnouncementId(Long idAnnouncement) {

            return announcementRepository.getTagsIdsFromAnnouncementId(idAnnouncement);
        }

        public String getAuthorUserName(Long idAnnouncement) {

            return announcementRepository.getAuthorUserName(idAnnouncement);
        }
    }
