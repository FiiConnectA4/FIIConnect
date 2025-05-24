package com.fiiconnect.api;

import com.fiiconnect.api.social_secretary.enums.TagType;
import com.fiiconnect.api.social_secretary.DTO.TagDTO;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TagDTOTest {

    @Test
    void testConstructorAndGetters() {
        TagDTO tagDTO = new TagDTO("TestTag", TagType.MATERIE);

        assertEquals("TestTag", tagDTO.getName());
        assertEquals(TagType.MATERIE, tagDTO.getType());
    }

    @Test
    void testSetters() {
        TagDTO tagDTO = new TagDTO("OldName", TagType.GENERAL);

        tagDTO.setName("NewName");
        tagDTO.setType(TagType.SEMINAR);

        assertEquals("NewName", tagDTO.getName());
        assertEquals(TagType.SEMINAR, tagDTO.getType());
    }

    @Test
    void testToString() {
        TagDTO tagDTO = new TagDTO("MyTag", TagType.AN);
        String str = tagDTO.toString();

        assertTrue(str.contains("MyTag"));
        assertTrue(str.contains("AN"));
        assertTrue(str.contains("TagDTO"));
    }
}
