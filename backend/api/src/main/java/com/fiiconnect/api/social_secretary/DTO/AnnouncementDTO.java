package com.fiiconnect.api.social_secretary.DTO;

import com.fiiconnect.api.auth_userMgmt.dtos.PersonInfoDTO;

import java.time.LocalDate;
import java.util.Set;

public class AnnouncementDTO {
    private String title;
    private String message;
    private PersonInfoDTO author;
    private Set<TagDTO> tags;
    private LocalDate publishedDate;

    public AnnouncementDTO(String title, String message, PersonInfoDTO author, Set<TagDTO> tags, LocalDate publishedDate) {
        this.title = title;
        this.message =   message;
        this.author = author;
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

    public PersonInfoDTO getAuthor() {
        return author;
    }

    public Set<TagDTO> getTags() {
        return tags;
    }

    public void setTags(Set<TagDTO> tags) {
        this.tags = tags;
    }

    public void setAuthor(PersonInfoDTO author) {
        this.author = author;
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
                ", author=" + author +
                ", tags=" + tags +
                '}';
    }
}
