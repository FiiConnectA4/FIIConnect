package com.fiiconnect.api.social_secretary;

import org.springframework.stereotype.Component;

@Component
public class UserLogat {
    private Long id;
    private String username;
    private String type; // Student, Profesor, Secretar

    public UserLogat() {}

    public UserLogat(Long id, String username, String type) {
        this.id = id;
        this.username = username;
        this.type = type;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}