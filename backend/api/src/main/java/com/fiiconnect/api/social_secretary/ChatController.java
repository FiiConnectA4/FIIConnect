package com.fiiconnect.api.social_secretary;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/chats")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public class ChatController {

    @Autowired
    private ChatService chatService;

    @GetMapping
    public List<Chat> getAllChats() {
        return chatService.getAllChats();
    }

    @PostMapping
    public Chat createChat(@RequestBody Chat chat) {
        return chatService.saveChat(chat);
    }
}
