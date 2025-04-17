package com.fiiconnect.api.social_secretary;

import jakarta.persistence.*;

@Entity
@Table(name = "ACHIEVEMENT")
public class Achievement {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "achievement_seq")
    @SequenceGenerator(name = "achievement_seq", sequenceName = "achievement_seq", allocationSize = 1)
    private Long id;

    private String name;
    private String description;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User_Anunturi user;

    private String dateAchieved;

    // Constructors, getters, setters

    public Achievement() {}

    public Achievement(String name, String description, User_Anunturi user, String dateAchieved) {
        this.name = name;
        this.description = description;
        this.user = user;
        this.dateAchieved = dateAchieved;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public User_Anunturi getUser() {
        return user;
    }

    public void setUser(User_Anunturi user) {
        this.user = user;
    }

    public String getDateAchieved() {
        return dateAchieved;
    }

    public void setDateAchieved(String dateAchieved) {
        this.dateAchieved = dateAchieved;
    }
}
