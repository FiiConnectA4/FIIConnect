package com.fiiconnect.api.social_secretary.service;

import com.fiiconnect.api.social_secretary.classes.Chat;
import com.fiiconnect.api.social_secretary.repository.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    public List<Chat> getAllChatMessages() {
        return chatRepository.findAllChats();
    }

    public Chat saveChatMessages(Chat chatMessage) {
        return chatRepository.save(chatMessage);
    }

    public Chat updateChat(Long id, Chat updatedChat) {
        Chat currentChat = chatRepository.findById(id).orElse(null);
        if(currentChat == null){
            System.out.println("acest id nu exista");
            return null;
        }
        currentChat.setMessage(updatedChat.getMessage());
        return chatRepository.save(currentChat);
    }

    public void deleteChat(Long id) {
        chatRepository.deleteById(id);
    }

    public List<Chat> findByChannelIdOrderByTimestampAsc(Long channelId) {
        return chatRepository.findByChannelIdOrderByTimestampAsc(channelId);
    }
}
