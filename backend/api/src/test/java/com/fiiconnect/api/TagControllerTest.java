package com.fiiconnect.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fiiconnect.api.social_secretary.classes.Tag;
import com.fiiconnect.api.social_secretary.enums.TagType;
import com.fiiconnect.api.social_secretary.service.TagService;
import com.fiiconnect.api.social_secretary.controller.TagController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class TagControllerTest {

    @Mock
    private TagService tagService;

    @InjectMocks
    private TagController tagController;

    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    @BeforeEach
    public void setup() {
        mockMvc = MockMvcBuilders.standaloneSetup(tagController).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    public void testCreateTag_Success() throws Exception {
        Tag tag = new Tag("TestTag", TagType.GENERAL);
        tag.setId(1L);

        when(tagService.save(any(Tag.class))).thenReturn(tag);

        mockMvc.perform(post("/tags")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(tag)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("TestTag"))
                .andExpect(jsonPath("$.type").value("GENERAL"));

        verify(tagService).save(any(Tag.class));
    }

    @Test
    public void testGetAllTags_Success() throws Exception {
        List<Tag> tags = List.of(
                new Tag("Tag1", TagType.AN),
                new Tag("Tag2", TagType.SEMINAR)
        );
        when(tagService.findAll()).thenReturn(tags);

        mockMvc.perform(get("/tags"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name").value("Tag1"))
                .andExpect(jsonPath("$[1].type").value("SEMINAR"));

        verify(tagService).findAll();
    }

    @Test
    public void testGetTagsByType_Success() throws Exception {
        List<Tag> tags = List.of(
                new Tag("Tag1", TagType.GRUPA),
                new Tag("Tag2", TagType.GRUPA)
        );
        when(tagService.findByType(TagType.GRUPA)).thenReturn(tags);

        mockMvc.perform(get("/tags/byType")
                        .param("type", "GRUPA"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].type").value("GRUPA"));

        verify(tagService).findByType(TagType.GRUPA);
    }

    @Test
    public void testUpdateTag_Success() throws Exception {
        Tag updatedTag = new Tag("UpdatedTag", TagType.MATERIE);
        updatedTag.setId(1L);

        when(tagService.updateTag(eq(1L), any(Tag.class))).thenReturn(updatedTag);

        mockMvc.perform(put("/tags/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedTag)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("UpdatedTag"))
                .andExpect(jsonPath("$.type").value("MATERIE"));

        verify(tagService).updateTag(eq(1L), any(Tag.class));
    }

    @Test
    public void testUpdateTag_NotFound() throws Exception {
        Tag updatedTag = new Tag("NoTag", TagType.SEMINAR);

        when(tagService.updateTag(eq(999L), any(Tag.class))).thenReturn(null);

        mockMvc.perform(put("/tags/999")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedTag)))
                .andExpect(status().isOk()) // controller returneaza null, deci 200 cu body null
                .andExpect(content().string(""));

        verify(tagService).updateTag(eq(999L), any(Tag.class));
    }

    @Test
    public void testDeleteTag_Success() throws Exception {
        doNothing().when(tagService).deleteTag(1L);

        mockMvc.perform(delete("/tags/1"))
                .andExpect(status().isOk());

        verify(tagService).deleteTag(1L);
    }
}
