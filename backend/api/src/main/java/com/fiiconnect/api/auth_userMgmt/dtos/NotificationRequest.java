package com.fiiconnect.api.auth_userMgmt.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class NotificationRequest {

    private String title;
    private String content;
    private String type;

    public NotificationRequest() {}

    public NotificationRequest(String title, String content, String type) {
        this.title = title;
        this.content = content;
        this.type = type;
    }
}