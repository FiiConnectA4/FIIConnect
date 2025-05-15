package com.fiiconnect.api.social_secretary.classes;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "CHANNEL")
public class Channel {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "channel_seq")
    @SequenceGenerator(name = "channel_seq", sequenceName = "channel_seq", allocationSize = 1)
    private Long id;

    private String name;

    @ManyToMany
    @JoinTable(
            name = "channel_tags",
            joinColumns = @JoinColumn(name = "channel_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
   // @JsonIgnore
    private Set<Tag> tags = new HashSet<>();

    public Channel() {
    }

    public Channel(Long id, String name, Set<Tag> tags) {
        this.id = id;
        this.name = name;
        this.tags = tags;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<Tag> getTags() {
        return tags;
    }

    public void setTags(Set<Tag> tags) {
        this.tags = tags;
    }

    @Override
    public String toString() {
        return "Channel{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", tags=" + tags +
                '}';
    }
}
