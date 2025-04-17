package com.fiiconnect.api.social_secretary;

import java.util.Set;

public class CreateUserRequest {
    private Long id;
    private String name;
    private Set<TagRequest> tags;

    public CreateUserRequest(Long id, String name, Set<TagRequest> tags) {
        this.id = id;
        this.name = name;
        this.tags = tags;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<TagRequest> getTags() {
        return tags;
    }

    public void setTags(Set<TagRequest> tags) {
        this.tags = tags;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }


    @Override
    public String toString() {
        return "CreateUserRequest{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", tags=" + tags +
                '}';
    }
}
