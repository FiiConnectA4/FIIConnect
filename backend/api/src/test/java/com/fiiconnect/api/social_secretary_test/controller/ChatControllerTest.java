package com.fiiconnect.api.social_secretary.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fiiconnect.api.social_secretary.classes.Chat;
import com.fiiconnect.api.social_secretary.classes.Emoji;
import com.fiiconnect.api.social_secretary.service.ChatService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class ChatControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ChatService chatService;

    @Mock
    private Emoji emoji;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private ChatController chatController;

    private ObjectMapper objectMapper;
    private Chat testChat;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(chatController).build();
        objectMapper = new ObjectMapper();
        testChat = createTestChat();
    }

    private Chat createTestChat() {
        Chat chat = new Chat();
        // Set up test chat - adjust based on your class structure
        return chat;
    }

    @Test
    void getAllChatMessages_ShouldReturnListOfChats() throws Exception {
        // Arrange
        List<Chat> chats = Arrays.asList(testChat);
        when(chatService.getAllChatMessages()).thenReturn(chats);

        // Act & Assert
        mockMvc.perform(get("/chat"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(chatService).getAllChatMessages();
    }

    @Test
    void getChannelMessages_ShouldReturnChannelChats() throws Exception {
        // Arrange
        List<Chat> chats = Arrays.asList(testChat);
        when(chatService.findByChannelIdOrderByTimestampAsc(1L)).thenReturn(chats);

        // Act & Assert
        mockMvc.perform(get("/chat/get-chats/1"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON));

        verify(chatService).findByChannelIdOrderByTimestampAsc(1L);
    }

    @Test
    void updateChat_ShouldReturnUpdatedChat() throws Exception {
        // Arrange
        when(chatService.updateChat(eq(1L), any(Chat.class))).thenReturn(testChat);

        // Act & Assert
        mockMvc.perform(put("/chat/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(testChat)))
                .andExpect(status().isOk());

        verify(chatService).updateChat(eq(1L), any(Chat.class));
    }

    @Test
    void deleteChat_ShouldCallDeleteService() throws Exception {
        // Arrange
        doNothing().when(chatService).deleteChat(1L);

        // Act & Assert
        mockMvc.perform(delete("/chat/1"))
                .andExpect(status().isOk());

        verify(chatService).deleteChat(1L);
    }
}
