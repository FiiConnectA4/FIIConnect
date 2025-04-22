package com.fiiconnect.api.social_secretary;

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
}
