package com.fiiconnect.api.social_secretary.DTO;

import java.time.LocalDate;
import java.util.Set;

public class AnnouncementDTO {
    private String title;
    private String message;
    private Long authorId;
    private Set<TagDTO> tags;
    private LocalDate publishedDate;

    public AnnouncementDTO(String title, String message, Long authorId, Set<TagDTO> tags, LocalDate publishedDate) {
        this.title = title;
        this.message =   message;
        this.authorId = authorId;
        this.tags = tags;
        this.publishedDate=publishedDate;
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

    public Long getAuthorId() {
        return authorId;
    }

    public Set<TagDTO> getTags() {
        return tags;
    }

    public void setTags(Set<TagDTO> tags) {
        this.tags = tags;
    }

    public void setAuthorId(Long author) {
        this.authorId = author;
    }

    public LocalDate getPublishedDate() {
        return publishedDate;
    }

    public void setPublishedDate(LocalDate publishedDate) {
        this.publishedDate = publishedDate;
    }

    @Override
    public String toString() {
        return "AnnouncementDTO{" +
                "title='" + title + '\'' +
                ", message='" + message + '\'' +
                ", author=" + authorId +
                ", tags=" + tags +
                '}';
    }
}
