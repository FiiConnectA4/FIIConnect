package com.fiiconnect.api.social_secretary.classes;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.Set;

@Entity
@Table(name = "USER_ANUNTURI")
public class User_Anunturi {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq")
    @SequenceGenerator(name = "user_seq", sequenceName = "user_seq", allocationSize = 1)
    private Long id;

    private String name;
    private String type; // Student, Profesor, Secretar

    @ManyToMany(cascade = CascadeType.PERSIST)
    @JoinTable(
            name = "users_tags",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    @JsonIgnore
    private Set<Tag> tags;

    public User_Anunturi() {}

    public User_Anunturi(String name, String type, Set<Tag> tags) {
        this.name = name;
        this.type = type;
        this.tags = tags;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public Set<Tag> getTags() { return tags; }
    public void setTags(Set<Tag> tags) { this.tags = tags; }
}