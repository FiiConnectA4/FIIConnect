package com.fiiconnect.api.social_secretary.controller;

import com.fiiconnect.api.auth_userMgmt.dtos.PersonInfoDTO;
import com.fiiconnect.api.social_secretary.service.ChatService;
import com.fiiconnect.api.social_secretary.classes.Chat;
import com.fiiconnect.api.social_secretary.classes.Emoji;
import jakarta.transaction.Transactional;
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

   // @Autowired
   // private UserService2 userService2;

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


    @MessageMapping("/chat.sendMessage")
    @Transactional  // Adaugă această annotare
    public Chat createChatMessage(@Payload Chat chatMessage) {
        System.out.println("am ajuns la chat.sendMessage");

        // Procesare mesaj
        String message = processEmojis(chatMessage.getMessage());
        chatMessage.setMessage(message);

        // Verifică sender
        Long senderId = chatMessage.getSender();
        System.out.println(senderId);

        chatMessage.setTimestamp(LocalDateTime.now().toString());

        // Salvează în baza de date ÎNAINTE de WebSocket
        Chat savedMessage = chatService.saveChatMessages(chatMessage);

        // Trimite prin WebSocket
        messagingTemplate.convertAndSend("/topic/channel/" + savedMessage.getChannelId(), savedMessage);
        return savedMessage;
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
