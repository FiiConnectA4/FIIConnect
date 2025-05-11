package com.fiiconnect.api.auth_userMgmt.services;


import com.fiiconnect.api.auth_userMgmt.models.Notification;
import com.fiiconnect.api.auth_userMgmt.models.User;
import com.fiiconnect.api.auth_userMgmt.repositories.NotificationRepository;
import com.fiiconnect.api.auth_userMgmt.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepo;

    @Autowired
    private UserRepository userRepo;

    public void sendNotificationToUser(Long userId, String title, String content, String type) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notification = new Notification();
        notification.setRecipient(user);
        notification.setTitle(title);
        notification.setContent(content);
        notification.setType(type);

        notificationRepo.save(notification);
    }
}
