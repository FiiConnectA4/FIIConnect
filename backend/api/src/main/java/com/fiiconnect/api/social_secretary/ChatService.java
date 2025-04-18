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

}
