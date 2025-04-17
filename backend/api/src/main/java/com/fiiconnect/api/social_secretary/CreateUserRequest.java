package com.fiiconnect.api.social_secretary;

import java.util.Set;

public class CreateUserRequest {
    private String name;
    private Set<TagRequest> tags;

    public CreateUserRequest(String name, Set<TagRequest> tags) {
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

    @Override
    public String toString() {
        return "CreateUserRequest{" +
                "name='" + name + '\'' +
                ", tags=" + tags +
                '}';
    }
}
