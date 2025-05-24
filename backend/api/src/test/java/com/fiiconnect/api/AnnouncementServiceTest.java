package com.fiiconnect.api;

import com.fiiconnect.api.social_secretary.DTO.AnnouncementDTO;
import com.fiiconnect.api.social_secretary.DTO.TagDTO;
import com.fiiconnect.api.social_secretary.DTO.UserDTO;
import com.fiiconnect.api.social_secretary.classes.Announcement;
import com.fiiconnect.api.social_secretary.classes.Tag;
import com.fiiconnect.api.social_secretary.classes.User_Anunturi;
import com.fiiconnect.api.social_secretary.classes.UserLogat;
import com.fiiconnect.api.social_secretary.enums.TagType;
import com.fiiconnect.api.social_secretary.repository.AnnouncementRepository;
import com.fiiconnect.api.social_secretary.repository.TagRepository;
import com.fiiconnect.api.social_secretary.service.AnnouncementService;
import com.fiiconnect.api.social_secretary.service.UserLogatService;
import com.fiiconnect.api.social_secretary.service.UserService2;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.time.LocalDate;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

class AnnouncementServiceTest {

    @InjectMocks
    private AnnouncementService announcementService;

    @Mock
    private AnnouncementRepository announcementRepository;

    @Mock
    private TagRepository tagRepository;

    @Mock
    private UserLogatService userLogatService;

    @Mock
    private UserService2 userService;

    private User_Anunturi user;
    private Announcement announcement;
    private Tag tag;
    private TagDTO tagDTO;
    private UserLogat userLogat;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);

        tag = new Tag("Java", TagType.MATERIE);
        tag.setId(1L);

        tagDTO = new TagDTO("Java", TagType.MATERIE);

        user = new User_Anunturi("Prof John", "Profesor", Set.of(tag));
        user.setId(1L);

        announcement = new Announcement("Title", "Message", user, Set.of(tag), LocalDate.now());
        announcement.setId(1L);

        // Creează userLogat conform clasei UserLogat
        userLogat = new UserLogat();
        userLogat.setId(1L);
        userLogat.setUsername("Prof John");
        userLogat.setType("Profesor");
    }


    @Test
    void testGetAllAnnouncements() {
        List<Announcement> announcements = List.of(announcement);
        when(announcementRepository.findAllOrderById()).thenReturn(announcements);

        List<Announcement> result = announcementService.getAllAnnouncements();

        assertThat(result).isEqualTo(announcements);
        verify(announcementRepository).findAllOrderById();
    }

    @Test
    void testSaveAnnouncement() {
        when(announcementRepository.save(any(Announcement.class))).thenReturn(announcement);

        Announcement result = announcementService.saveAnnouncement(announcement);

        assertThat(result).isEqualTo(announcement);
        verify(announcementRepository).save(announcement);
    }

    @Test
    void testGetAnnouncementById_Found() {
        when(announcementRepository.findById(1L)).thenReturn(Optional.of(announcement));

        Announcement result = announcementService.getAnnouncementById(1L);

        assertThat(result).isEqualTo(announcement);
        verify(announcementRepository).findById(1L);
    }

    @Test
    void testGetAnnouncementById_NotFound() {
        when(announcementRepository.findById(1L)).thenReturn(Optional.empty());

        Announcement result = announcementService.getAnnouncementById(1L);

        assertThat(result).isNull();
        verify(announcementRepository).findById(1L);
    }

    @Test
    void testDeleteAnnouncement() {
        doNothing().when(announcementRepository).deleteById(1L);

        announcementService.deleteAnnouncement(1L);

        verify(announcementRepository).deleteById(1L);
    }

    /*@Test
    void testUpdateAnnouncement_Success() {
        AnnouncementDTO dto = new AnnouncementDTO(
                "Updated Title",
                "Updated Message",
                null,
                Set.of(tagDTO),
                LocalDate.now().plusDays(1)
        );

        when(announcementRepository.findById(1L)).thenReturn(Optional.of(announcement));
        when(userLogatService.getUserLogat()).thenReturn(userLogat);
        when(userService.getUserById(1L)).thenReturn(user);
        when(tagRepository.findByNameAndType("Java", TagType.MATERIE)).thenReturn(tag);
        when(announcementRepository.save(any(Announcement.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Announcement updated = announcementService.updateAnnouncement(1L, dto);

        assertThat(updated).isNotNull();
        assertThat(updated.getTitle()).isEqualTo("Updated Title");
        assertThat(updated.getMessage()).isEqualTo("Updated Message");
        assertThat(updated.getPublishedDate()).isEqualTo(dto.getPublishedDate());
        assertThat(updated.getTags()).containsExactlyInAnyOrder(tag);
        assertThat(updated.getAuthor()).isEqualTo(user);
    }*/

    @Test
    void testUpdateAnnouncement_IdNotFound() {
        when(announcementRepository.findById(1L)).thenReturn(Optional.empty());

        AnnouncementDTO dto = new AnnouncementDTO("Title", "Message", null, Collections.emptySet(), LocalDate.now());
        Announcement result = announcementService.updateAnnouncement(1L, dto);

        assertThat(result).isNull();
        verify(announcementRepository).findById(1L);
    }

    @Test
    void testUpdateAnnouncement_UserNotLoggedIn() {
        when(announcementRepository.findById(1L)).thenReturn(Optional.of(announcement));
        when(userLogatService.getUserLogat()).thenReturn(null);

        AnnouncementDTO dto = new AnnouncementDTO("Title", "Message", null, Collections.emptySet(), LocalDate.now());
        Announcement result = announcementService.updateAnnouncement(1L, dto);

        assertThat(result).isNull();
    }

    @Test
    void testUpdateAnnouncement_UserNoPrivileges() {
        User_Anunturi studentUser = new User_Anunturi("Student", "Student", Collections.emptySet());
        studentUser.setId(2L);

        UserLogat studentLogat = new UserLogat();
        studentLogat.setId(2L);
        studentLogat.setUsername("Student");
        studentLogat.setType("Student");

        when(announcementRepository.findById(1L)).thenReturn(Optional.of(announcement));
        when(userLogatService.getUserLogat()).thenReturn(studentLogat);
        when(userService.getUserById(2L)).thenReturn(studentUser);

        AnnouncementDTO dto = new AnnouncementDTO("Title", "Message", null, Collections.emptySet(), LocalDate.now());
        Announcement result = announcementService.updateAnnouncement(1L, dto);

        assertThat(result).isNull();
    }

    @Test
    void testGetAllAnnouncementsId() {
        List<Long> ids = List.of(1L, 2L);
        when(announcementRepository.getAllAnnouncementsId(1L)).thenReturn(ids);

        List<Long> result = announcementService.getAllAnnouncementsId(1L);

        assertThat(result).isEqualTo(ids);
    }

    @Test
    void testGetAnnouncementsByUserId() {
        Set<Announcement> announcements = Set.of(announcement);
        when(announcementRepository.getAnnouncementsByUserId(1L)).thenReturn(announcements);

        Set<Announcement> result = announcementService.getAnnouncementsByUserId(1L);

        assertThat(result).isEqualTo(announcements);
    }

    @Test
    void testGetTagsIdsFromAnnouncementId() {
        List<Long> tagIds = List.of(1L);
        when(announcementRepository.getTagsIdsFromAnnouncementId(1L)).thenReturn(tagIds);

        List<Long> result = announcementService.getTagsIdsFromAnnouncementId(1L);

        assertThat(result).isEqualTo(tagIds);
    }

    @Test
    void testGetAuthorUserName() {
        when(announcementRepository.getAuthorUserName(1L)).thenReturn("Prof John");

        String result = announcementService.getAuthorUserName(1L);

        assertThat(result).isEqualTo("Prof John");
    }
}
