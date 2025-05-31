package com.fiiconnect.api.social_secretary.classes;


import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.HashSet;
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

   // @ManyToOne(cascade = CascadeType.PERSIST)
   // @JoinColumn(name = "author_id")
   //@JsonIgnore
    private Long author;

    @ManyToMany//(cascade = CascadeType.PERSIST)
    @JoinTable(
            name = "announcement_tags",
            joinColumns = @JoinColumn(name = "announcement_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    //@JsonIgnore
    private Set<Tag> tags = new HashSet<>();

    private LocalDate publishedDate;

    public Announcement() {}

    public Announcement(String title, String message, Long author, Set<Tag> tags, LocalDate publishedDate) {
        this.title = title;
        this.message = message;
        this.author = author;
        this.tags = tags;
        this.publishedDate = publishedDate;
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public Long getAuthor() { return author; }
    public void setAuthor(Long author) { this.author = author; }
    public Set<Tag> getTags() { return tags; }
    public void setTags(Set<Tag> tags) { this.tags = tags; }
    public LocalDate getPublishedDate() { return publishedDate; }
    public void setPublishedDate(LocalDate publishedDate) { this.publishedDate = publishedDate; }
}
