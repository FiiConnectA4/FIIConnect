package com.fiiconnect.api.social_secretary;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "ANNOUNCEMENT")
public class Announcement {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "announcement_seq")
    @SequenceGenerator(name = "announcement_seq", sequenceName = "announcement_seq", allocationSize = 1)
    private Long id;

    private String title;
    private String message;

    @ManyToOne(cascade = CascadeType.PERSIST)
    @JoinColumn(name = "professor_id")
    @JsonIgnore
    private User_Anunturi professor;

    @ManyToMany(cascade = CascadeType.PERSIST)
    @JoinTable(
            name = "announcement_tags",
            joinColumns = @JoinColumn(name = "announcement_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    @JsonIgnore
    private Set<Tag> tags;

    // Constructors, getters, setters

    public Announcement() {}

    public Announcement(String title, String message, User_Anunturi professor, Set<Tag> tags) {
        this.title = title;
        this.message = message;
        this.professor = professor;
        this.tags = tags;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public User_Anunturi getProfessor() {
        return professor;
    }

    public void setProfessor(User_Anunturi professor) {
        this.professor = professor;
    }

    public Set<Tag> getTags() {
        return tags;
    }

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }

    @Override
    public String toString() {
        return "Announcement{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", message='" + message + '\'' +
                ", professor=" + professor +
                ", tags=" + tags +
                '}';
    }
}
