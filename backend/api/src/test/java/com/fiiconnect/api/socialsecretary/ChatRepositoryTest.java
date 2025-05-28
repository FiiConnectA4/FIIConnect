package com.fiiconnect.api.socialsecretary;

import com.fiiconnect.api.social_secretary.classes.Chat;
import com.fiiconnect.api.social_secretary.enums.ChatType;
import com.fiiconnect.api.social_secretary.repository.ChatRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class ChatRepositoryTest {

    @Autowired
    private ChatRepository chatRepository;

    @Test
    @DisplayName("Save and verify Chat exists")
    void testSaveChatAndVerifyItExists() {
        // Arrange
        Chat chat = new Chat("Hello!", 123L, "2025-05-27T10:00", ChatType.CHAT, 999L);

        // Act
        chatRepository.save(chat);
        List<Chat> chats = chatRepository.findAll();

        // Assert
        assertThat(chats).isNotEmpty();
        Chat savedChat = chats.get(0);
        assertThat(savedChat.getMessage()).isEqualTo("Hello!");
        assertThat(savedChat.getSender()).isEqualTo(123L);
        assertThat(savedChat.getType()).isEqualTo(ChatType.CHAT);
        assertThat(savedChat.getChannelId()).isEqualTo(999L);
        assertThat(savedChat.getTimestamp()).isEqualTo("2025-05-27T10:00");
    }

    @Test
    @DisplayName("Save multiple chats and count them")
    void testSaveMultipleChats() {
        // Arrange
        Chat chat1 = new Chat("M1", 1L, "2025-01-01T12:00", ChatType.JOIN, 1L);
        Chat chat2 = new Chat("M2", 2L, "2025-01-01T13:00", ChatType.LEAVE, 2L);

        // Act
        chatRepository.save(chat1);
        chatRepository.save(chat2);
        List<Chat> chats = chatRepository.findAll();

        // Assert
        assertThat(chats).hasSize(2);
    }
}
