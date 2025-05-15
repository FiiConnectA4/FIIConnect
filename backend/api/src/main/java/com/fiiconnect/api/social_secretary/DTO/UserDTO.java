package com.fiiconnect.api.social_secretary.DTO;

import java.util.Set;

public class UserDTO {
    private Long id;
    private String name;
    private String type;
    private Set<TagDTO> tags;

    public UserDTO(Long id, String name, String type, Set<TagDTO> tags) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.tags = tags;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Set<TagDTO> getTags() {
        return tags;
    }

    public void setTags(Set<TagDTO> tags) {
        this.tags = tags;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "UserDTO{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", tags=" + tags +
                '}';
    }

}
