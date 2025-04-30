package com.fiiconnect.api.social_secretary.DTO;

import java.time.LocalDate;
import java.util.Set;

public class AnnouncementDTO {
    private String title;
    private String message;
    private UserDTO professor;
    private Set<TagDTO> tags;
    private LocalDate publishedDate;

    public AnnouncementDTO(String title, String message, UserDTO professor, Set<TagDTO> tags, LocalDate publishedDate) {
        this.title = title;
        this.message =   message;
        this.professor = professor;
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

    public UserDTO getProfessor() {
        return professor;
    }

    public void setUser(UserDTO professor) {
        this.professor = professor;
    }

    public Set<TagDTO> getTags() {
        return tags;
    }

    public void setTags(Set<TagDTO> tags) {
        this.tags = tags;
    }

    public void setProfessor(UserDTO professor) {
        this.professor = professor;
    }

    public LocalDate getPublishedDate() {
        return publishedDate;
    }

    public void setPublishedDate(LocalDate publishedDate) {
        this.publishedDate = publishedDate;
    }

    @Override
    public String toString() {
        return "CreateAnnouncementRequest{" +
                "title='" + title + '\'' +
                ", message='" + message + '\'' +
                ", professor=" + professor +
                ", tags=" + tags +
                '}';
    }
}
