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

    @ManyToOne
    @JoinColumn(name = "receiver_id")
    private User_Anunturi receiver;

    private String timestamp;

    // Constructors, getters, setters

    public Chat() {}

    public Chat(String message, User_Anunturi sender, User_Anunturi receiver, String timestamp) {
        this.message = message;
        this.sender = sender;
        this.receiver = receiver;
        this.timestamp = timestamp;
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

    public User_Anunturi getReceiver() {
        return receiver;
    }

    public void setReceiver(User_Anunturi receiver) {
        this.receiver = receiver;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }
}
