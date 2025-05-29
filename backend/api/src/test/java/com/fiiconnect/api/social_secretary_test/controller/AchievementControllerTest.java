package com.fiiconnect.api.social_secretary_test.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fiiconnect.api.social_secretary.classes.Achievement;
import com.fiiconnect.api.social_secretary.controller.AchievementController;
import com.fiiconnect.api.social_secretary.service.AchievementService;
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
public class AchievementControllerTest {

    private MockMvc mockMvc;

    @Mock
    private AchievementService achievementService;

    @InjectMocks
    private AchievementController achievementController;

    private ObjectMapper objectMapper;
    private Achievement testAchievement;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(achievementController).build();
        objectMapper = new ObjectMapper();
        testAchievement = createTestAchievement();
    }

    private Achievement createTestAchievement() {
        Achievement achievement = new Achievement();
        // Create test achievement - adjust based on your Achievement class structure
        return achievement;
    }

    @Test
    void getAllAchievements_ShouldReturnListOfAchievements() throws Exception {
        // Arrange
        List<Achievement> achievements = Arrays.asList(testAchievement);
        when(achievementService.getAllAchievements()).thenReturn(achievements);

        // Act & Assert
        mockMvc.perform(get("/achievements"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(achievementService).getAllAchievements();
    }

    @Test
    void createAchievement_ShouldReturnCreatedAchievement() throws Exception {
        // Arrange
        when(achievementService.saveAchievement(any(Achievement.class))).thenReturn(testAchievement);

        // Act & Assert
        mockMvc.perform(post("/achievements")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testAchievement)))
                .andExpect(status().isOk());

        verify(achievementService).saveAchievement(any(Achievement.class));
    }

    @Test
    void updateAchievement_ShouldReturnUpdatedAchievement() throws Exception {
        // Arrange
        when(achievementService.updateAchievement(eq(1L), any(Achievement.class))).thenReturn(testAchievement);

        // Act & Assert
        mockMvc.perform(put("/achievements/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testAchievement)))
                .andExpect(status().isOk());

        verify(achievementService).updateAchievement(eq(1L), any(Achievement.class));
    }

    @Test
    void deleteAchievement_ShouldCallDeleteService() throws Exception {
        // Arrange
        doNothing().when(achievementService).deleteAchievement(1L);

        // Act & Assert
        mockMvc.perform(delete("/achievements/1"))
                .andExpect(status().isOk());

        verify(achievementService).deleteAchievement(1L);
    }
}
