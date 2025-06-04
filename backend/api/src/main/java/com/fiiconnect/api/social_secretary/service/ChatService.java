package com.fiiconnect.api.social_secretary.service;

import com.fiiconnect.api.social_secretary.classes.Achievement;
import com.fiiconnect.api.social_secretary.classes.AchievementManager;
import com.fiiconnect.api.social_secretary.classes.Chat;
import com.fiiconnect.api.social_secretary.repository.ChatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ChatService {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private AchievementManagerService achievementManagerService;

    @Autowired
    private AchievementService achievementService;

    public List<Chat> getAllChatMessages() {
        return chatRepository.findAllChats();
    }

    public Chat saveChatMessages(Chat chatMessage) {
        //check for achievements
        System.out.println("am ajuns in chat service inainte de count");
        Integer messageCount = chatRepository.getUserMessageCount(chatMessage.getSender())+1;
        System.out.println("asta e messagecountul " + messageCount);
        Achievement achievement;
        if(messageCount==1){
            achievement=achievementService.getAchievementByName("Primul mesaj");
            achievementManagerService.addAchievementToUser(
                    chatMessage.getSender(), achievement.getId());
        }
        else if(messageCount == 5){
            achievement=achievementService.getAchievementByName("Yapper");
            achievementManagerService.addAchievementToUser(
                    chatMessage.getSender(), achievement.getId());
        }
        else if(messageCount == 20){
            achievement=achievementService.getAchievementByName("Popular");
            achievementManagerService.addAchievementToUser(
                    chatMessage.getSender(), achievement.getId());
        }

        //save the message to the db
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
