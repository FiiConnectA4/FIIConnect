package com.fiiconnect.api.social_secretary;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cglib.core.Local;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Controller
@RestController
@RequestMapping("/chat")
//@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public class ChatController {

    @Autowired
    private Emoji emoji;

    @Autowired
    private ChatService chatService;

    @Autowired
    private UserService userService;

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
    @SendTo("/topic/public")//unde trimitem
    public Chat createChatMessage(@Payload Chat chatMessage) {
        //niste procesare pe viitor pt emoji uri si chestii
        String message = chatMessage.getMessage();
        message=processEmojis(message);

        long senderId = chatMessage.getSender().getId();
        User_Anunturi sender=userService.getUserById(senderId);
        chatMessage.setSender(sender);
        chatMessage.setTimestamp(LocalDateTime.now().toString());
        chatMessage.setMessage(message);
        if(userService.getUserById(senderId)==null){
            System.out.println("user ul nu exista");
            return new Chat("user-ul nu exista",null,null);
        }


        return chatService.saveChatMessages(chatMessage);
    }

    @MessageMapping("/chat.addUser")
    @SendTo("/topic/public")
    public Chat addUser(Chat chatMessage) {
        chatMessage.setType(ChatType.JOIN);
        chatMessage.setTimestamp(String.valueOf(LocalDateTime.now()).toString());
        chatMessage.setMessage(chatMessage.getSender() + " joined the chat");
        chatService.saveChatMessages(chatMessage);
        return chatMessage;
    }
}
