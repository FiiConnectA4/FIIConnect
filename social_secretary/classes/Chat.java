package com.fiiconnect.api.social_secretary.classes;

import com.fiiconnect.api.social_secretary.enums.ChatType;
import jakarta.persistence.*;

@Entity
@Table(name = "CHAT")
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "chat_seq")
    @SequenceGenerator(name = "chat_seq", sequenceName = "chat_seq", allocationSize = 1)
    private Long id;

    private String message;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User_Anunturi sender;


    private String timestamp;

    @Enumerated(EnumType.STRING)
    private ChatType type;


    private Long channelId;
    // Constructors, getters, setters

    public Chat() {}

    public Chat(String message, User_Anunturi sender, String timestamp, ChatType type, Long channelId) {
        this.message = message;
        this.sender = sender;
        this.timestamp = timestamp;
        this.type = type;
        this.channelId=channelId;
    }

    public ChatType getType() {
        return type;
    }

    public void setType(ChatType type) {
        this.type = type;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public User_Anunturi getSender() {
        return sender;
    }

    public void setSender(User_Anunturi sender) {
        this.sender = sender;
    }



    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public Long getChannelId() {
        return channelId;
    }

    public void setChannelId(Long channelId) {
        this.channelId = channelId;
    }
}
