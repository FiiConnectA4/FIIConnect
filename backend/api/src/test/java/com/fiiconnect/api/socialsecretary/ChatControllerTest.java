package com.fiiconnect.api.socialsecretary;

import com.fiiconnect.api.social_secretary.classes.Chat;
import com.fiiconnect.api.social_secretary.enums.ChatType;
import com.fiiconnect.api.social_secretary.service.ChatService;
import com.fiiconnect.api.social_secretary.controller.ChatController;
import com.fiiconnect.api.social_secretary.classes.Emoji;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ChatControllerTest {

    @Mock
    private ChatService chatService;

    @Mock
    private Emoji emoji;

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private ChatController chatController;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);

        // Configurăm emoji pentru testare
        when(emoji.getEmojiCodes()).thenReturn(new String[]{":smile:"});
        when(emoji.getEmojiByCode(":smile:")).thenReturn("😄");
    }

    @Test
    public void testGetAllChatMessages() {
        Chat chat = new Chat("Salut", 1L, "2024-05-27T10:00:00", ChatType.CHAT, 100L);
        when(chatService.getAllChatMessages()).thenReturn(List.of(chat));

        List<Chat> result = chatController.getAllChatMessages();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Salut", result.get(0).getMessage());
    }

    @Test
    public void testGetChannelMessages() {
        Long channelId = 123L;
        Chat chat = new Chat("Test mesaj", 1L, "2024-05-27T11:00:00", ChatType.CHAT, channelId);
        when(chatService.findByChannelIdOrderByTimestampAsc(channelId)).thenReturn(List.of(chat));

        ResponseEntity<List<Chat>> response = chatController.getChannelMessages(channelId);

        assertEquals(200, response.getStatusCodeValue());
        assertEquals(1, response.getBody().size());
        assertEquals("Test mesaj", response.getBody().get(0).getMessage());
    }

    @Test
    public void testCreateChatMessage() {
        Chat inputChat = new Chat(":smile: Salut!", 1L, null, ChatType.CHAT, 42L);
        Chat savedChat = new Chat("😄 Salut!", 1L, "2024-05-27T11:00:00", ChatType.CHAT, 42L);
        when(chatService.saveChatMessages(any(Chat.class))).thenReturn(savedChat);

        Chat result = chatController.createChatMessage(inputChat);

        assertNotNull(result);
        assertEquals("😄 Salut!", result.getMessage());
        assertEquals(42L, result.getChannelId());

        verify(messagingTemplate, times(1)).convertAndSend(eq("/topic/channel/42"), any(Chat.class));
    }

    @Test
    public void testUpdateChat() {
        Chat updated = new Chat("Mesaj actualizat", 1L, "2024-05-27T12:00:00", ChatType.CHAT, 55L);
        when(chatService.updateChat(1L, updated)).thenReturn(updated);

        Chat result = chatController.updateChat(1L, updated);

        assertEquals("Mesaj actualizat", result.getMessage());
    }

    @Test
    public void testDeleteChat() {
        doNothing().when(chatService).deleteChat(1L);

        assertDoesNotThrow(() -> chatController.deleteChat(1L));

        verify(chatService, times(1)).deleteChat(1L);
    }
}
