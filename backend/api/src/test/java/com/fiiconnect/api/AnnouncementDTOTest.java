package com.fiiconnect.api;

import com.fiiconnect.api.social_secretary.DTO.AnnouncementDTO;
import com.fiiconnect.api.social_secretary.DTO.TagDTO;
import com.fiiconnect.api.social_secretary.DTO.UserDTO;
import com.fiiconnect.api.social_secretary.enums.TagType;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

class AnnouncementDTOTest {

    @Test
    void testAnnouncementDTO_GettersAndSetters() {
        // Setup date initiale
        UserDTO professor = new UserDTO(1L, "John Doe", "Profesor", Collections.emptySet());
        TagDTO tag1 = new TagDTO("Mathematics", TagType.MATERIE);
        Set<TagDTO> tags = new HashSet<>();
        tags.add(tag1);
        LocalDate publishedDate = LocalDate.of(2025, 5, 24);

        // Creare instanta folosind constructorul
        AnnouncementDTO announcementDTO = new AnnouncementDTO(
                "Titlu Anunt",
                "Mesaj Anunt",
                professor,
                tags,
                publishedDate
        );

        // Verificam getter-ele
        assertEquals("Titlu Anunt", announcementDTO.getTitle());
        assertEquals("Mesaj Anunt", announcementDTO.getMessage());
        assertEquals(professor, announcementDTO.getProfessor());
        assertEquals(tags, announcementDTO.getTags());
        assertEquals(publishedDate, announcementDTO.getPublishedDate());

        // Testam setter-ele
        announcementDTO.setTitle("Alt Titlu");
        assertEquals("Alt Titlu", announcementDTO.getTitle());

        announcementDTO.setMessage("Alt Mesaj");
        assertEquals("Alt Mesaj", announcementDTO.getMessage());

        UserDTO altProfessor = new UserDTO(2L, "Jane Smith", "Profesor", Collections.emptySet());
        announcementDTO.setProfessor(altProfessor);
        assertEquals(altProfessor, announcementDTO.getProfessor());

        TagDTO tag2 = new TagDTO("Informatica", TagType.MATERIE);
        Set<TagDTO> altTags = new HashSet<>();
        altTags.add(tag2);
        announcementDTO.setTags(altTags);
        assertEquals(altTags, announcementDTO.getTags());

        LocalDate altDate = LocalDate.of(2026, 1, 1);
        announcementDTO.setPublishedDate(altDate);
        assertEquals(altDate, announcementDTO.getPublishedDate());
    }

    @Test
    void testToString() {
        UserDTO professor = new UserDTO(1L, "John Doe", "Profesor", Collections.emptySet());
        TagDTO tag1 = new TagDTO("Mathematics", TagType.MATERIE);
        Set<TagDTO> tags = new HashSet<>();
        tags.add(tag1);
        LocalDate publishedDate = LocalDate.now();

        AnnouncementDTO announcementDTO = new AnnouncementDTO(
                "Titlu",
                "Mesaj",
                professor,
                tags,
                publishedDate
        );

        String toStringResult = announcementDTO.toString();

        assertTrue(toStringResult.contains("Titlu"));
        assertTrue(toStringResult.contains("Mesaj"));
        assertTrue(toStringResult.contains("John Doe"));
        assertTrue(toStringResult.contains("Mathematics"));
    }
}
