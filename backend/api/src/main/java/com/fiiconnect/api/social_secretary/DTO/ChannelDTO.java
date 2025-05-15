package com.fiiconnect.api.social_secretary.DTO;

import java.util.Set;

public class ChannelDTO {
    private String name;
    private Set<TagDTO> tags;

    public ChannelDTO() {
    }

    public ChannelDTO(String name, Set<TagDTO> tags) {
        this.name = name;
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

    @Override
    public String toString() {
        return "ChannelDTO{" +
                "name='" + name + '\'' +
                ", tags=" + tags +
                '}';
    }
}
