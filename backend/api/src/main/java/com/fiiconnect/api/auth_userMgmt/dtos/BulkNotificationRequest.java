package com.fiiconnect.api.auth_userMgmt.dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class BulkNotificationRequest {
    private List<Long> recipientIds;
    private String title;
    private String content;
    private String type;
}
