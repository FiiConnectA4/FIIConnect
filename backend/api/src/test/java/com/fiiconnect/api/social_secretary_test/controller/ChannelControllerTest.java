package com.fiiconnect.api.social_secretary_test.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fiiconnect.api.social_secretary.DTO.ChannelDTO;
import com.fiiconnect.api.social_secretary.classes.Channel;
import com.fiiconnect.api.social_secretary.controller.ChannelController;
import com.fiiconnect.api.social_secretary.service.ChannelService;
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
public class ChannelControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ChannelService channelService;

    @InjectMocks
    private ChannelController channelController;

    private ObjectMapper objectMapper;
    private Channel testChannel;
    private ChannelDTO testChannelDTO;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(channelController).build();
        objectMapper = new ObjectMapper();
        testChannel = createTestChannel();
        testChannelDTO = createTestChannelDTO();
    }

    private Channel createTestChannel() {
        Channel channel = new Channel();
        // Set up test channel - adjust based on your class structure
        return channel;
    }

    private ChannelDTO createTestChannelDTO() {
        ChannelDTO dto = new ChannelDTO();
        // Set up test DTO - adjust based on your class structure
        return dto;
    }

    @Test
    void getAllChannels_ShouldReturnListOfChannels() throws Exception {
        // Arrange
        List<Channel> channels = Arrays.asList(testChannel);
        when(channelService.getAllChannels()).thenReturn(channels);

        // Act & Assert
        mockMvc.perform(get("/channel"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(channelService).getAllChannels();
    }

    @Test
    void getAllChannelsWithTags_ShouldReturnFilteredChannels() throws Exception {
        // Arrange
        List<Channel> channels = Arrays.asList(testChannel);
        when(channelService.getAllChannelsWithTags(anyList())).thenReturn(channels);

        // Act & Assert
        mockMvc.perform(get("/channel/with-tags")
                        .param("tagIds", "1,2,3"))
                .andExpect(status().isOk());

        verify(channelService).getAllChannelsWithTags(anyList());
    }

    @Test
    void saveChannel_ShouldReturnCreatedChannel() throws Exception {
        // Arrange
        when(channelService.saveChannel(any(ChannelDTO.class))).thenReturn(testChannel);

        // Act & Assert
        mockMvc.perform(post("/channel")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testChannelDTO)))
                .andExpect(status().isOk());

        verify(channelService).saveChannel(any(ChannelDTO.class));
    }

    @Test
    void updateChannel_ShouldReturnUpdatedChannel() throws Exception {
        // Arrange
        when(channelService.updateChannel(eq(1L), any(ChannelDTO.class))).thenReturn(testChannel);

        // Act & Assert
        mockMvc.perform(put("/channel/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testChannelDTO)))
                .andExpect(status().isOk());

        verify(channelService).updateChannel(eq(1L), any(ChannelDTO.class));
    }

    @Test
    void deleteChannel_ShouldCallDeleteService() throws Exception {
        // Arrange
        doNothing().when(channelService).deleteChannel(1L);

        // Act & Assert
        mockMvc.perform(delete("/channel/1"))
                .andExpect(status().isOk());

        verify(channelService).deleteChannel(1L);
    }
}