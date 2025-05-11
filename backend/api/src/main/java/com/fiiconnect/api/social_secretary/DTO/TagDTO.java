package com.fiiconnect.api.social_secretary.DTO;

import com.fiiconnect.api.social_secretary.enums.TagType;

public class TagDTO {
    private String name;
    private TagType type;

    public TagDTO(String name, TagType type) {
        this.name = name;
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public TagType getType() {
        return type;
    }

    public void setType(TagType type) {
        this.type = type;
    }

    @Override
    public String toString() {
        return "TagDTO{" +
                "name='" + name + '\'' +
                ", type=" + type +
                '}';
    }
}
