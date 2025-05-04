package com.fiiconnect.api.social_secretary;

import jakarta.persistence.*;
import java.util.Set;

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

    private Long channel_id;

    private String timestamp;

    @Enumerated(EnumType.STRING)
    private ChatType type;
    // Constructors, getters, setters

    public Chat() {}

    public Chat(String message, User_Anunturi sender, String timestamp, ChatType type) {
        this.message = message;
        this.sender = sender;
        this.timestamp = timestamp;
        this.type = type;
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

    public Long getChannel_id() {
        return channel_id;
    }

    public void setChannel_id(Long channel_id) {
        this.channel_id = channel_id;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
