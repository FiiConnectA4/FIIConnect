package com.fiiconnect.api;

import com.fiiconnect.api.social_secretary.DTO.AnnouncementDTO;
import com.fiiconnect.api.social_secretary.DTO.TagDTO;
import com.fiiconnect.api.social_secretary.DTO.UserDTO;
import com.fiiconnect.api.social_secretary.classes.Announcement;
import com.fiiconnect.api.social_secretary.classes.Tag;
import com.fiiconnect.api.social_secretary.classes.User_Anunturi;
import com.fiiconnect.api.social_secretary.enums.TagType;
import com.fiiconnect.api.social_secretary.service.AnnouncementService;
import com.fiiconnect.api.social_secretary.service.TagService;
import com.fiiconnect.api.social_secretary.service.UserLogatService;
import com.fiiconnect.api.social_secretary.service.UserService2;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import com.fiiconnect.api.social_secretary.controller.AnnouncementController;
import com.fiiconnect.api.social_secretary.service.AnnouncementService;
import com.fiiconnect.api.social_secretary.classes.UserLogat;
import java.time.LocalDate;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AnnouncementControllerTest {

    private AnnouncementService announcementService;
    private TagService tagService;
    private UserService2 userService2;
    private UserLogatService userLogatService;
    private AnnouncementController announcementController;

    @BeforeEach
    void setup() {
        announcementService = mock(AnnouncementService.class);
        tagService = mock(TagService.class);
        userService2 = mock(UserService2.class);
        userLogatService = mock(UserLogatService.class);

        announcementController = new AnnouncementController();
        // inject mocks manually since no Spring context
        announcementController.announcementService = announcementService;
        announcementController.tagService = tagService;
        announcementController.userService2 = userService2;
        announcementController.userLogatService = userLogatService;
    }
    @Test
    void testCreateAnnouncement_Success() {
        // Setup DTOs
        TagDTO tagDTO = new TagDTO("Java", TagType.MATERIE);
        Set<TagDTO> tagsDTO = Set.of(tagDTO);

        UserDTO professorDTO = new UserDTO(1L, "Prof John", "Profesor", Collections.emptySet());

        AnnouncementDTO announcementDTO = new AnnouncementDTO(
                "New Announcement",
                "This is a test announcement.",
                professorDTO,
                tagsDTO,
                LocalDate.now()
        );

        // Setup Entities for mocks
        Tag tag = new Tag("Java", TagType.MATERIE);
        tag.setId(10L);

        User_Anunturi user = new User_Anunturi("Prof John", "Profesor", Collections.emptySet());
        user.setId(1L);

        Announcement savedAnnouncement = new Announcement(
                announcementDTO.getTitle(),
                announcementDTO.getMessage(),
                user,
                Set.of(tag),
                announcementDTO.getPublishedDate()
        );
        savedAnnouncement.setId(100L);

        // Creează UserLogat pentru mock
        UserLogat loggedUser = new UserLogat();
        loggedUser.setId(1L);
        loggedUser.setUsername("Prof John");
        loggedUser.setType("Profesor");  // adaptează dacă ai alte câmpuri

        // Mock behavior
        when(tagService.findByNameAndType("Java", TagType.MATERIE)).thenReturn(tag);
        when(userService2.getUserById(1L)).thenReturn(user);
        when(userLogatService.getUserLogat()).thenReturn(loggedUser);  // schimbat aici: returnează UserLogat
        when(announcementService.saveAnnouncement(any(Announcement.class))).thenReturn(savedAnnouncement);

        // Call controller method
        Announcement result = announcementController.createAnnouncement(announcementDTO);

        // Verify and assert
        assertNotNull(result);
        assertEquals("New Announcement", result.getTitle());
        assertEquals(user.getId(), result.getAuthor().getId());
        verify(announcementService).saveAnnouncement(any(Announcement.class));
    }

    @Test
    void testCreateAnnouncement_InvalidTag() {
        TagDTO tagDTO = new TagDTO("InvalidTag", TagType.GENERAL);
        Set<TagDTO> tagsDTO = Set.of(tagDTO);

        UserDTO professorDTO = new UserDTO(1L, "Prof John", "Profesor", Collections.emptySet());

        AnnouncementDTO announcementDTO = new AnnouncementDTO(
                "Invalid Tag Announcement",
                "Message",
                professorDTO,
                tagsDTO,
                LocalDate.now()
        );

        // Mock tagService returns null -> invalid tag
        when(tagService.findByNameAndType("InvalidTag", TagType.GENERAL)).thenReturn(null);

        Announcement result = announcementController.createAnnouncement(announcementDTO);

        assertNull(result);
        verify(announcementService, never()).saveAnnouncement(any());
    }

    @Test
    void testDeleteAnnouncement_Success() {
        User_Anunturi user = new User_Anunturi("Prof John", "Profesor", Collections.emptySet());
        user.setId(1L);

        Announcement announcement = new Announcement();
        announcement.setId(1L);
        announcement.setAuthor(user);

        // Creează UserLogat
        UserLogat loggedUser = new UserLogat();
        loggedUser.setId(1L);
        loggedUser.setUsername("Prof John");
        loggedUser.setType("Profesor");

        when(announcementService.getAnnouncementById(1L)).thenReturn(announcement);
        when(userLogatService.getUserLogat()).thenReturn(loggedUser);
        when(userService2.getUserById(1L)).thenReturn(user);

        announcementController.deleteAnnouncement(1L);

        verify(announcementService).deleteAnnouncement(1L);
    }


    @Test
    void testDeleteAnnouncement_NoPermission() {
        User_Anunturi author = new User_Anunturi("Prof John", "Profesor", Collections.emptySet());
        author.setId(2L);

        Announcement announcement = new Announcement();
        announcement.setId(1L);
        announcement.setAuthor(author);

        UserLogat loggedUser = new UserLogat();
        // setează id-ul userului logat ca să fie diferit de author-ul anunțului
        loggedUser.setId(1L);
        loggedUser.setUsername("Another User");
        // ... set alte câmpuri dacă ai nevoie

        when(announcementService.getAnnouncementById(1L)).thenReturn(announcement);
        when(userLogatService.getUserLogat()).thenReturn(loggedUser);
        when(userService2.getUserById(1L)).thenReturn(new User_Anunturi("Another User", "Profesor", Collections.emptySet()));

        announcementController.deleteAnnouncement(1L);

        verify(announcementService, never()).deleteAnnouncement(anyLong());
    }
}
