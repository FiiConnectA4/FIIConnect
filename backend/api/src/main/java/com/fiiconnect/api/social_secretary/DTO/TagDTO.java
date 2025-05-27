package com.fiiconnect.api.social_secretary.DTO;

import com.fiiconnect.api.social_secretary.enums.TagType;

public class TagDTO {
    private Long id;
    private String name;
    private TagType type;

    public TagDTO() {}

    public TagDTO(String name, TagType type) {
        this.name = name;
        this.type = type;
    }

    public TagDTO(Long id, String name, TagType type) {
        this.id = id;
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

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public String toString() {
        return "TagDTO{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", type=" + type +
                '}';
    }
}
