package com.fiiconnect.api.social_secretary_test.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fiiconnect.api.auth_userMgmt.dtos.PersonInfoDTO;
import com.fiiconnect.api.auth_userMgmt.dtos.StudentDTO;
import com.fiiconnect.api.auth_userMgmt.dtos.ProfessorDTO;
import com.fiiconnect.api.auth_userMgmt.repositories.UserRepository;
import com.fiiconnect.api.social_secretary.DTO.AnnouncementDTO;
import com.fiiconnect.api.social_secretary.DTO.TagDTO;
import com.fiiconnect.api.social_secretary.classes.Announcement;
import com.fiiconnect.api.social_secretary.controller.AnnouncementController;
import com.fiiconnect.api.social_secretary.enums.TagType;
import com.fiiconnect.api.social_secretary.service.AnnouncementService;
import com.fiiconnect.api.social_secretary.service.TagService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.util.*;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class AnnouncementControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AnnouncementService announcementService;

    @Mock
    private TagService tagService;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AnnouncementController announcementController;

    private ObjectMapper objectMapper;
    private Announcement testAnnouncement;
    private AnnouncementDTO testAnnouncementDTO;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(announcementController).build();
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule()); // Handle LocalDate serialization
        testAnnouncement = createTestAnnouncement();
        testAnnouncementDTO = createTestAnnouncementDTO();
    }

    private Announcement createTestAnnouncement() {
        Announcement announcement = new Announcement();
        // Set up test announcement - adjust based on your class structure
        return announcement;
    }

    private PersonInfoDTO createTestPersonInfoDTO() {
        // Create test tags for PersonInfoDTO
        Set<TagDTO> userTags = new HashSet<>();
        userTags.add(new TagDTO("USER_TAG", TagType.GENERAL));

        return new PersonInfoDTO(
                1L,                    // userId
                "testuser",            // username
                "test@example.com",    // email
                "PROFESSOR",           // role
                null,                  // student (null since role is PROFESSOR)
                new ProfessorDTO(
                        1L,                     // id
                        "1234567890123",        // cnp
                        "John",                 // firstName
                        "Doe",                  // lastName
                        "Professor"             // rank
                ),
                userTags               // tags
        );
    }

    private AnnouncementDTO createTestAnnouncementDTO() {
        PersonInfoDTO author = createTestPersonInfoDTO();

        Set<TagDTO> tags = new HashSet<>();
        TagDTO tag1 = new TagDTO("ANNOUNCEMENT", TagType.GENERAL);
        TagDTO tag2 = new TagDTO("IMPORTANT", TagType.GENERAL);
        tags.add(tag1);
        tags.add(tag2);

        return new AnnouncementDTO(
                "Test Announcement Title",
                "Test announcement message content",
                author,
                tags,
                LocalDate.now()
        );
    }

    @Test
    void getAllAnnouncements_ShouldReturnListOfAnnouncements() throws Exception {
        // Arrange
        List<Announcement> announcements = Arrays.asList(testAnnouncement);
        when(announcementService.getAllAnnouncements()).thenReturn(announcements);

        // Act & Assert
        mockMvc.perform(get("/announcement"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(announcementService).getAllAnnouncements();
    }

    @Test
    void createAnnouncement_WithValidDTO_ShouldReturnCreatedAnnouncement() throws Exception {
        // Arrange
        when(announcementService.saveAnnouncement(any(AnnouncementDTO.class))).thenReturn(testAnnouncement);

        // Act & Assert
        mockMvc.perform(post("/announcement/prof-secretar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testAnnouncementDTO)))
                .andExpect(status().isOk());

        verify(announcementService).saveAnnouncement(any(AnnouncementDTO.class));
    }

    @Test
    void createAnnouncement_WithEmptyTitle_ShouldHandleValidation() throws Exception {
        // Arrange
        PersonInfoDTO author = createTestPersonInfoDTO();
        Set<TagDTO> tags = new HashSet<>();
        tags.add(new TagDTO("TEST", TagType.GENERAL));

        AnnouncementDTO invalidDTO = new AnnouncementDTO(
                "", // Empty title
                "Valid message",
                author,
                tags,
                LocalDate.now()
        );

        // Act & Assert
        mockMvc.perform(post("/announcement/prof-secretar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidDTO)))
                .andExpect(status().isOk()); // Adjust expected status based on validation

        verify(announcementService).saveAnnouncement(any(AnnouncementDTO.class));
    }

    @Test
    void createAnnouncement_WithNullAuthor_ShouldHandleValidation() throws Exception {
        // Arrange
        Set<TagDTO> tags = new HashSet<>();
        tags.add(new TagDTO("TEST", TagType.GENERAL));

        AnnouncementDTO invalidDTO = new AnnouncementDTO(
                "Valid title",
                "Valid message",
                null, // Null author
                tags,
                LocalDate.now()
        );

        // Act & Assert
        mockMvc.perform(post("/announcement/prof-secretar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalidDTO)))
                .andExpect(status().isOk()); // Adjust expected status based on validation

        verify(announcementService).saveAnnouncement(any(AnnouncementDTO.class));
    }

    @Test
    void getAnnouncementById_ShouldReturnAnnouncement() throws Exception {
        // Arrange
        when(announcementService.getAnnouncementById(1L)).thenReturn(testAnnouncement);

        // Act & Assert
        mockMvc.perform(get("/announcement/1"))
                .andExpect(status().isOk());

        verify(announcementService).getAnnouncementById(1L);
    }

    @Test
    void getAnnouncementsWithTags_ShouldReturnFilteredAnnouncements() throws Exception {
        // Arrange
        when(announcementService.getAllAnnouncementsId(anyLong())).thenReturn(Arrays.asList(1L));
        when(announcementService.getAnnouncementById(1L)).thenReturn(testAnnouncement);

        // Act & Assert
        mockMvc.perform(get("/announcement/with-tag")
                        .param("tagIds", "1", "2"))
                .andExpect(status().isOk());

        verify(announcementService, atLeastOnce()).getAllAnnouncementsId(anyLong());
    }

    @Test
    void getAuthorUserName_ShouldReturnUserName() throws Exception {
        // Arrange
        when(announcementService.getAuthorUserName(1L)).thenReturn("TestUser");

        // Act & Assert
        mockMvc.perform(get("/announcement/1/userName"))
                .andExpect(status().isOk())
                .andExpect(content().string("TestUser"));

        verify(announcementService).getAuthorUserName(1L);
    }

    @Test
    void updateAnnouncement_WithValidDTO_ShouldReturnUpdatedAnnouncement() throws Exception {
        // Arrange
        PersonInfoDTO author = createTestPersonInfoDTO();
        Set<TagDTO> tags = new HashSet<>();
        tags.add(new TagDTO("UPDATED", TagType.GENERAL));

        AnnouncementDTO updatedDTO = new AnnouncementDTO(
                "Updated Title",
                "Updated message content",
                author,
                tags,
                LocalDate.now()
        );
        when(announcementService.updateAnnouncement(eq(1L), any(AnnouncementDTO.class))).thenReturn(testAnnouncement);

        // Act & Assert
        mockMvc.perform(put("/announcement/prof-secretar/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedDTO)))
                .andExpect(status().isOk());

        verify(announcementService).updateAnnouncement(eq(1L), any(AnnouncementDTO.class));
    }

    @Test
    void updateAnnouncement_WithPastPublishedDate_ShouldWork() throws Exception {
        // Arrange
        PersonInfoDTO author = createTestPersonInfoDTO();
        Set<TagDTO> tags = new HashSet<>();
        tags.add(new TagDTO("PAST", TagType.GENERAL));

        AnnouncementDTO pastDateDTO = new AnnouncementDTO(
                "Title",
                "Message",
                author,
                tags,
                LocalDate.now().minusDays(5) // Past date
        );
        when(announcementService.updateAnnouncement(eq(1L), any(AnnouncementDTO.class))).thenReturn(testAnnouncement);

        // Act & Assert
        mockMvc.perform(put("/announcement/prof-secretar/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(pastDateDTO)))
                .andExpect(status().isOk());

        verify(announcementService).updateAnnouncement(eq(1L), any(AnnouncementDTO.class));
    }

// ========================================
// 7. ADDITIONAL AnnouncementDTO SPECIFIC TESTS
// ========================================

    @Test
    void createAnnouncement_WithMultipleTags_ShouldWork() throws Exception {
        // Arrange
        Set<TagDTO> multipleTags = new HashSet<>();
        TagDTO tag1 = new TagDTO("GENERAL", TagType.GENERAL);
        TagDTO tag2 = new TagDTO("URGENT", TagType.GENERAL);
        TagDTO tag3 = new TagDTO("ACADEMIC", TagType.GENERAL);
        multipleTags.add(tag1);
        multipleTags.add(tag2);
        multipleTags.add(tag3);

        AnnouncementDTO multiTagDTO = new AnnouncementDTO(
                "Multi-tag Announcement",
                "This announcement has multiple tags",
                createTestPersonInfoDTO(),
                multipleTags,
                LocalDate.now()
        );

        when(announcementService.saveAnnouncement(any(AnnouncementDTO.class))).thenReturn(testAnnouncement);

        // Act & Assert
        mockMvc.perform(post("/announcement/prof-secretar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(multiTagDTO)))
                .andExpect(status().isOk());

        verify(announcementService).saveAnnouncement(any(AnnouncementDTO.class));
    }

    @Test
    void createAnnouncement_WithFuturePublishedDate_ShouldWork() throws Exception {
        // Arrange
        Set<TagDTO> tags = new HashSet<>();
        tags.add(new TagDTO("FUTURE", TagType.GENERAL));

        AnnouncementDTO futureDTO = new AnnouncementDTO(
                "Future Announcement",
                "This will be published in the future",
                createTestPersonInfoDTO(),
                tags,
                LocalDate.now().plusDays(7) // Future date
        );

        when(announcementService.saveAnnouncement(any(AnnouncementDTO.class))).thenReturn(testAnnouncement);

        // Act & Assert
        mockMvc.perform(post("/announcement/prof-secretar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(futureDTO)))
                .andExpect(status().isOk());

        verify(announcementService).saveAnnouncement(any(AnnouncementDTO.class));
    }

    @Test
    void createAnnouncement_WithLongMessage_ShouldWork() throws Exception {
        // Arrange
        String longMessage = "This is a very long message content that simulates a real announcement with detailed information. ".repeat(10);
        Set<TagDTO> tags = new HashSet<>();
        tags.add(new TagDTO("LONG_CONTENT", TagType.GENERAL));

        AnnouncementDTO longMessageDTO = new AnnouncementDTO(
                "Long Message Announcement",
                longMessage,
                createTestPersonInfoDTO(),
                tags,
                LocalDate.now()
        );

        when(announcementService.saveAnnouncement(any(AnnouncementDTO.class))).thenReturn(testAnnouncement);

        // Act & Assert
        mockMvc.perform(post("/announcement/prof-secretar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(longMessageDTO)))
                .andExpect(status().isOk());

        verify(announcementService).saveAnnouncement(any(AnnouncementDTO.class));
    }

    @Test
    void updateAnnouncement_ChangingOnlyTitle_ShouldWork() throws Exception {
        // Arrange
        AnnouncementDTO titleOnlyUpdate = new AnnouncementDTO(
                "New Title Only", // Only title changed
                testAnnouncementDTO.getMessage(), // Keep original message
                testAnnouncementDTO.getAuthor(), // Keep original author
                testAnnouncementDTO.getTags(), // Keep original tags
                testAnnouncementDTO.getPublishedDate() // Keep original date
        );

        when(announcementService.updateAnnouncement(eq(1L), any(AnnouncementDTO.class))).thenReturn(testAnnouncement);

        // Act & Assert
        mockMvc.perform(put("/announcement/prof-secretar/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(titleOnlyUpdate)))
                .andExpect(status().isOk());

        verify(announcementService).updateAnnouncement(eq(1L), any(AnnouncementDTO.class));
    }

    @Test
    void createAnnouncement_WithStudentAuthor_ShouldWork() throws Exception {
        // Arrange - Create PersonInfoDTO with student role
        Set<TagDTO> userTags = new HashSet<>();
        userTags.add(new TagDTO("STUDENT_TAG", TagType.GENERAL));

        PersonInfoDTO studentAuthor = new PersonInfoDTO(
                2L,                    // userId
                "studentuser",         // username
                "student@example.com", // email
                "STUDENT",            // role
                new StudentDTO(
                        1L,                    // id
                        "1234567890123",       // cnp
                        "A1234567",            // regNumber
                        "Jane",                // firstName
                        "Smith",               // lastName
                        3,                     // year
                        "Info3A"               // facultyGroup
                ),
                null,                 // professor (null since role is STUDENT)
                userTags              // tags
        );

        Set<TagDTO> announcementTags = new HashSet<>();
        announcementTags.add(new TagDTO("STUDENT_ANNOUNCEMENT", TagType.GENERAL));

        AnnouncementDTO studentAnnouncementDTO = new AnnouncementDTO(
                "Student Announcement",
                "This announcement is from a student",
                studentAuthor,
                announcementTags,
                LocalDate.now()
        );

        when(announcementService.saveAnnouncement(any(AnnouncementDTO.class))).thenReturn(testAnnouncement);

        // Act & Assert
        mockMvc.perform(post("/announcement/prof-secretar")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(studentAnnouncementDTO)))
                .andExpect(status().isOk());

        verify(announcementService).saveAnnouncement(any(AnnouncementDTO.class));
    }
}