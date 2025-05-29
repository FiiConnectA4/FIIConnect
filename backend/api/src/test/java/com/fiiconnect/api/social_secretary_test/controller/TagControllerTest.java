package com.fiiconnect.api.social_secretary_test.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fiiconnect.api.social_secretary.classes.Tag;
import com.fiiconnect.api.social_secretary.controller.TagController;
import com.fiiconnect.api.social_secretary.enums.TagType;
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

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class TagControllerTest {

    private MockMvc mockMvc;

    @Mock
    private TagService tagService;

    @InjectMocks
    private TagController tagController;

    private ObjectMapper objectMapper;
    private Tag testTag;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(tagController).build();
        objectMapper = new ObjectMapper();
        testTag = createTestTag();
    }

    private Tag createTestTag() {
        Tag tag = new Tag();
        // Set up test tag - adjust based on your class structure
        return tag;
    }

    @Test
    void createTag_ShouldReturnCreatedTag() throws Exception {
        // Arrange
        when(tagService.save(any(Tag.class))).thenReturn(testTag);

        // Act & Assert
        mockMvc.perform(post("/tags")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testTag)))
                .andExpect(status().isOk());

        verify(tagService).save(any(Tag.class));
    }

    @Test
    void getAllTags_ShouldReturnListOfTags() throws Exception {
        // Arrange
        List<Tag> tags = Arrays.asList(testTag);
        when(tagService.findAll()).thenReturn(tags);

        // Act & Assert
        mockMvc.perform(get("/tags"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(tagService).findAll();
    }

    @Test
    void getTagsByType_ShouldReturnFilteredTags() throws Exception {
        // Arrange
        List<Tag> tags = Arrays.asList(testTag);
        when(tagService.findByType(any(TagType.class))).thenReturn(tags);

        // Act & Assert
        mockMvc.perform(get("/tags/byType")
                        .param("type", "GENERAL"))
                .andExpect(status().isOk());

        verify(tagService).findByType(any(TagType.class));
    }

    @Test
    void updateTag_ShouldReturnUpdatedTag() throws Exception {
        // Arrange
        when(tagService.updateTag(eq(1L), any(Tag.class))).thenReturn(testTag);

        // Act & Assert
        mockMvc.perform(put("/tags/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testTag)))
                .andExpect(status().isOk());

        verify(tagService).updateTag(eq(1L), any(Tag.class));
    }

    @Test
    void deleteTag_ShouldCallDeleteService() throws Exception {
        // Arrange
        doNothing().when(tagService).deleteTag(1L);

        // Act & Assert
        mockMvc.perform(delete("/tags/1"))
                .andExpect(status().isOk());

        verify(tagService).deleteTag(1L);
    }
}