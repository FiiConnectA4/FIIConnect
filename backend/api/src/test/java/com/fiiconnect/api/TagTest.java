package com.fiiconnect.api;

import com.fiiconnect.api.social_secretary.enums.TagType;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;
import com.fiiconnect.api.social_secretary.classes.Tag;

public class TagTest {

    @Test
    public void testTagConstructorAndGetters() {
        Tag tag = new Tag("Programare", TagType.MATERIE);

        assertEquals("Programare", tag.getName());
        assertEquals(TagType.MATERIE, tag.getType());
    }

    @Test
    public void testSetters() {
        Tag tag = new Tag();
        tag.setName("Grupa 101");
        tag.setType(TagType.GRUPA);
        tag.setId(10L);

        assertEquals("Grupa 101", tag.getName());
        assertEquals(TagType.GRUPA, tag.getType());
        assertEquals(10L, tag.getId());
    }

    @Test
    public void testToString() {
        Tag tag = new Tag("General", TagType.GENERAL);
        String result = tag.toString();

        assertTrue(result.contains("General"));
        assertTrue(result.contains("GENERAL"));
    }
}
