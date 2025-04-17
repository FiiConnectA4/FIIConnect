package com.fiiconnect.api.social_secretary;

public class TagRequest {
    private String name;
    private TagType type;

    public TagRequest(String name, TagType type) {
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
        return "TagRequest{" +
                "name='" + name + '\'' +
                ", type=" + type +
                '}';
    }
}
