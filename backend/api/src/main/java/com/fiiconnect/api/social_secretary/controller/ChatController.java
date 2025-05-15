package com.fiiconnect.api.social_secretary.controller;

import com.fiiconnect.api.social_secretary.service.ChatService;
import com.fiiconnect.api.social_secretary.service.UserService2;
import com.fiiconnect.api.social_secretary.classes.Chat;
import com.fiiconnect.api.social_secretary.classes.Emoji;
import com.fiiconnect.api.social_secretary.classes.User_Anunturi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Controller
@RestController
@RequestMapping("/chat")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public class ChatController {

    @Autowired
    private Emoji emoji;

    @Autowired
    private ChatService chatService;

    @Autowired
    private UserService2 userService2;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping
    public List<Chat> getAllChatMessages() {
        return chatService.getAllChatMessages();
    }

    private String processEmojis(String message){
        String words[] = message.split(" ");
        String [] codes = emoji.getEmojiCodes();
        StringBuilder sb = new StringBuilder();
        for(String word : words){
            for(String code : codes){
                if(code.equals(word)){
                    word = emoji.getEmojiByCode(code);
                    break;
                }
            }
            sb.append(word + " ");
        }
        return sb.toString();
    }


    @MessageMapping("/chat.sendMessage")//de aici invocam aceasta metoda
    public Chat createChatMessage(@Payload Chat chatMessage) {
        System.out.println("am ajuns la chat.sendMessage");
        //niste procesare pe viitor pt emoji uri si chestii
        String message = chatMessage.getMessage();
        message=processEmojis(message);

        long senderId = chatMessage.getSender().getId();
        User_Anunturi sender= userService2.getUserById(senderId);
        chatMessage.setSender(sender);
        chatMessage.setTimestamp(LocalDateTime.now().toString());
        chatMessage.setMessage(message);
        if(userService2.getUserById(senderId)==null){
            System.out.println("user ul nu exista");
            return new Chat("user-ul nu exista",null,null, null,null);
        }

        Long channelId = chatMessage.getChannelId();
        messagingTemplate.convertAndSend("/topic/channel/" + channelId, chatMessage);
        return chatService.saveChatMessages(chatMessage);
    }

    /*@MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public Chat addUser(Chat chatMessage) {
        chatMessage.setType(ChatType.JOIN);
        chatMessage.setTimestamp(String.valueOf(LocalDateTime.now()).toString());
        chatMessage.setMessage(chatMessage.getSender() + " joined the chat");
        chatService.saveChatMessages(chatMessage);
        return chatMessage;
    }

     */

    @GetMapping("/get-chats/{channelId}")
    public ResponseEntity<List<Chat>> getChannelMessages(
            @PathVariable Long channelId) {

        System.out.println("aducem mesajele de pe un anumit canal");
        List<Chat> messages = chatService.findByChannelIdOrderByTimestampAsc(channelId);
        if(!messages.isEmpty())
            System.out.println("lista nu e goala");
        return ResponseEntity.ok(messages);
    }

    @PutMapping("/{id}")
    public Chat updateChat(@PathVariable Long id, @RequestBody Chat updatedChat){
        return chatService.updateChat(id,updatedChat);
    }

    @DeleteMapping("/{id}")
    public void deleteChat(@PathVariable Long id){
        chatService.deleteChat(id);
    }
}
