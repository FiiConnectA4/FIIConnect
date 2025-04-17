package com.fiiconnect.api.social_secretary;

import java.util.Set;

public class CreateAnnouncementRequest {
    private String title;
    private String message;
    private CreateUserRequest professor;
    private Set<TagRequest> tags;

    public CreateAnnouncementRequest(String title, String message, CreateUserRequest professor, Set<TagRequest> tags) {
        this.title = title;
        this.message = message;
        this.professor = professor;
        this.tags = tags;
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

    public CreateUserRequest getProfessor() {
        return professor;
    }

    public void setUser(CreateUserRequest professor) {
        this.professor = professor;
    }

    public Set<TagRequest> getTags() {
        return tags;
    }

    public void setTags(Set<TagRequest> tags) {
        this.tags = tags;
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
