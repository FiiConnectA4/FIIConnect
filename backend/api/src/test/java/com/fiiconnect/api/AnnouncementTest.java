package com.fiiconnect.api;

import com.fiiconnect.api.social_secretary.classes.Announcement;
import com.fiiconnect.api.social_secretary.classes.Tag;
import com.fiiconnect.api.social_secretary.classes.User_Anunturi;
import com.fiiconnect.api.social_secretary.enums.TagType;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

public class AnnouncementTest {

    private Announcement announcement;
    private User_Anunturi user;
    private Set<Tag> tags;

    @BeforeEach
    void setUp() {
        // Mock Tag
        Tag tag1 = new Tag("Informatica", TagType.MATERIE);
        Tag tag2 = new Tag("Anul 1", TagType.AN);
        tags = new HashSet<>();
        tags.add(tag1);
        tags.add(tag2);

        // Mock User
        user = new User_Anunturi("Popescu Ion", "Student", tags);

        // Create Announcement
        announcement = new Announcement(
                "Titlu test",
                "Mesaj test",
                user,
                tags,
                LocalDate.of(2024, 10, 1)
        );
    }

    @Test
    void testAnnouncementFields() {
        assertEquals("Titlu test", announcement.getTitle());
        assertEquals("Mesaj test", announcement.getMessage());
        assertEquals(user, announcement.getAuthor());
        assertEquals(tags, announcement.getTags());
        assertEquals(LocalDate.of(2024, 10, 1), announcement.getPublishedDate());
    }

    @Test
    void testSettersAndGetters() {
        announcement.setTitle("Alt titlu");
        announcement.setMessage("Alt mesaj");

        assertEquals("Alt titlu", announcement.getTitle());
        assertEquals("Alt mesaj", announcement.getMessage());
    }

    @Test
    void testTagsCanBeUpdated() {
        Tag newTag = new Tag("Seminar 3", TagType.SEMINAR);
        tags.add(newTag);
        announcement.setTags(tags);

        assertTrue(announcement.getTags().contains(newTag));
        assertEquals(3, announcement.getTags().size());
    }

    @Test
    void testAuthorCanBeChanged() {
        User_Anunturi profesor = new User_Anunturi("Prof. Ionescu", "Profesor", new HashSet<>());
        announcement.setAuthor(profesor);

        assertEquals("Profesor", announcement.getAuthor().getType());
        assertEquals("Prof. Ionescu", announcement.getAuthor().getName());
    }
}
