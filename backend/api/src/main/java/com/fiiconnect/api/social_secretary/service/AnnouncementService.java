package com.fiiconnect.api.social_secretary.service;

import com.fiiconnect.api.auth_userMgmt.dtos.ProfessorDTO;
import com.fiiconnect.api.auth_userMgmt.dtos.StudentDTO;
import com.fiiconnect.api.auth_userMgmt.models.Role;
import com.fiiconnect.api.didactic.models.Professor;
import com.fiiconnect.api.didactic.models.Student;
import com.fiiconnect.api.social_secretary.DTO.AnnouncementDTO;
import com.fiiconnect.api.social_secretary.DTO.TagDTO;
import com.fiiconnect.api.social_secretary.classes.Announcement;
import com.fiiconnect.api.social_secretary.classes.Tag;
import com.fiiconnect.api.social_secretary.repository.AnnouncementRepository;
import com.fiiconnect.api.social_secretary.repository.TagRepository;
import com.fiiconnect.api.auth_userMgmt.models.User;
import com.fiiconnect.api.auth_userMgmt.dtos.PersonInfoDTO;
import com.fiiconnect.api.auth_userMgmt.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnnouncementService {

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Autowired
    private TagRepository tagRepository;

    @Autowired
    private TagService tagService;

    @Autowired
    private UserRepository userRepository;

    // Get all announcements (as entities)
    public List<Announcement> getAllAnnouncements() {
        return announcementRepository.findAllOrderById();
    }

    // Get all announcements as DTOs (with full author info)
    public List<AnnouncementDTO> getAllAnnouncementDTOs() {
        List<Announcement> announcements = getAllAnnouncements();
        return announcements.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Save a new announcement
    public Announcement saveAnnouncement(AnnouncementDTO announcementDTO) {
        Set<TagDTO> tagsRequest = announcementDTO.getTags();
        Set<Tag> tags = new HashSet<>();

        // Validate and process tags
        for (TagDTO t : tagsRequest) {
            Tag existingTag = tagService.findByNameAndType(t.getName(), t.getType());
            if (existingTag == null) {
                System.out.println("Tag invalid: " + t.getName());
                return null;
            }
            tags.add(existingTag);
        }

        Long authorId = announcementDTO.getAuthorId();
        if (authorId == null) {
            System.out.println("Author ID is missing.");
            return null;
        }

        // Optionally, check user role here if needed
        User user = userRepository.findById(authorId).orElse(null);
        if (user == null) {
            System.out.println("User not found.");
            return null;
        }
        if ("ROLE_STUDENT".equalsIgnoreCase(user.getRoles().toString())) {
            System.out.println("Student users cannot post announcements.");
            return null;
        }

        LocalDate today = LocalDate.now();

        Announcement announcement = new Announcement(
                announcementDTO.getTitle(),
                announcementDTO.getMessage(),
                authorId,
                tags,
                today
        );
        return announcementRepository.save(announcement);
    }

    // Convert Announcement entity to DTO (with full author info)
    public AnnouncementDTO toDTO(Announcement announcement) {
        User user = userRepository.findById(announcement.getAuthor()).orElse(null);
        PersonInfoDTO authorDTO = null;


        String role = user.getRoles().stream().findFirst().map(Role::getRoleName).orElse("UNKNOWN");

        StudentDTO studentDTO = null;
        if (user.getStudent() != null) {
            Student s = user.getStudent();
            studentDTO = new StudentDTO(s.getId(), s.getCnp(), s.getRegNumber(), s.getFirstName(), s.getLastName(), s.getYear(), s.getFacultyGroup());
        }

        ProfessorDTO profDTO = null;
        if (user.getProfessor() != null) {
            Professor p = user.getProfessor();
            profDTO = new ProfessorDTO(p.getId(), p.getCnp(), p.getFirstName(), p.getLastName(), p.getRank());
        }

        Set<TagDTO> tagDTOs = user.getTags().stream()
                .map(tag -> new TagDTO(tag.getName(), tag.getType()))
                .collect(Collectors.toSet());

        if (user != null) {
            authorDTO = new PersonInfoDTO(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    role,
                    studentDTO,
                    profDTO,
                    tagDTOs
                    /// si asta
            );
        }
        Set<TagDTO> announcementTagDTOs = announcement.getTags().stream()
                .map(tag -> new TagDTO(tag.getName(), tag.getType()))
                .collect(Collectors.toSet());
        return new AnnouncementDTO(
                announcement.getTitle(),
                announcement.getMessage(),
                authorDTO != null ? authorDTO.userId() : null, // Only the ID in the DTO
                announcementTagDTOs,
                announcement.getPublishedDate()
        );
    }

    // Get announcement by ID (entity)
    public Announcement getAnnouncementById(Long id) {
        return announcementRepository.findById(id).orElse(null);
    }

    // Get announcement by ID (DTO)
    public AnnouncementDTO getAnnouncementDTOById(Long id) {
        Announcement announcement = getAnnouncementById(id);
        return announcement != null ? toDTO(announcement) : null;
    }

    // Delete announcement (only if user is the author)
    public void deleteAnnouncement(Long id, Long userId) {
        Announcement existingAnnouncement = announcementRepository.findById(id).orElse(null);

        if (existingAnnouncement == null) {
            System.out.println("Anunțul nu există.");
        } else if (!userId.equals(existingAnnouncement.getAuthor())) {
            System.out.println("User-ul nu are dreptul de a modifica anuntul.");
        } else {
            announcementRepository.deleteById(id);
        }
    }

    // Update announcement (only if user is the author)
    public Announcement updateAnnouncement(Long id, AnnouncementDTO updatedAnnouncement) {
        Announcement currentAnnouncement = announcementRepository.findById(id).orElse(null);

        if (currentAnnouncement == null) {
            System.out.println("Anunțul nu există.");
            return null;
        }

        if (!updatedAnnouncement.getAuthorId().equals(currentAnnouncement.getAuthor())) {
            System.out.println("User-ul nu are dreptul de a modifica anuntul.");
            return null;
        }

        currentAnnouncement.setAuthor(updatedAnnouncement.getAuthorId());
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

    // Get all announcement IDs for a tag
    public List<Long> getAllAnnouncementsId(Long tagId) {
        return announcementRepository.getAllAnnouncementsId(tagId);
    }

    // Get all announcements by user ID
    public Set<Announcement> getAnnouncementsByUserId(Long id) {
        return announcementRepository.getAnnouncementsByUserId(id);
    }

    // Get tag IDs from announcement ID
    public List<Long> getTagsIdsFromAnnouncementId(Long idAnnouncement) {
        return announcementRepository.getTagsIdsFromAnnouncementId(idAnnouncement);
    }

    // Get author's username from announcement ID
    public String getAuthorUserName(Long idAnnouncement) {
        return announcementRepository.getAuthorUserName(idAnnouncement);
    }
}