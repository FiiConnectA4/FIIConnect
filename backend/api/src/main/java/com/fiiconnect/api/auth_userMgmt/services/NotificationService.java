package com.fiiconnect.api.auth_userMgmt.services;

import com.fiiconnect.api.auth_userMgmt.dtos.BulkNotificationRequest;
import com.fiiconnect.api.auth_userMgmt.dtos.NotificationResponse;
import com.fiiconnect.api.auth_userMgmt.models.Notification;
import com.fiiconnect.api.auth_userMgmt.models.User;
import com.fiiconnect.api.auth_userMgmt.repositories.NotificationRepository;
import com.fiiconnect.api.auth_userMgmt.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepo;
    private final UserRepository userRepo;
    private final SimpMessagingTemplate messagingTemplate;

    public NotificationResponse sendToOne(User user, BulkNotificationRequest req) {
        Notification n = new Notification();
        n.setRecipient(user);
        n.setTitle(req.getTitle());
        n.setContent(req.getContent());
        n.setType(req.getType());
        n.setTimestamp(LocalDateTime.now());

        notificationRepo.save(n);

        NotificationResponse dto = map(n);
        messagingTemplate.convertAndSendToUser(user.getUsername(), "/queue/notifications", dto);
        return dto;
    }

    public List<NotificationResponse> sendBulk(BulkNotificationRequest req) {
        List<User> recipients = userRepo.findAllById(req.getRecipientIds());

        List<Notification> entities = recipients.stream()
                .map(u -> {
                    Notification n = new Notification();
                    n.setRecipient(u);
                    n.setTitle(req.getTitle());
                    n.setContent(req.getContent());
                    n.setType(req.getType());
                    n.setTimestamp(LocalDateTime.now());
                    return n;
                })
                .toList();

        notificationRepo.saveAll(entities); // single round-trip la DB

        return entities.stream()
                .map(n -> {
                    NotificationResponse dto = map(n);
                    messagingTemplate.convertAndSendToUser(
                            n.getRecipient().getUsername(),
                            "/queue/notifications",
                            dto
                    );
                    return dto;
                })
                .toList();
    }

    public List<NotificationResponse> getLimitedNotifications(User user, int limit, Boolean readStatus) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Notification> notifications = notificationRepo.findLimitedByUserAndReadStatus(user, readStatus, pageable);

        return notifications.stream()
                .map(this::map)
                .toList();
    }

    private NotificationResponse map(Notification n) {
        return new NotificationResponse(
                n.getId(),
                n.getTitle(),
                n.getContent(),
                n.getType(),
                n.isRead(),
                n.getTimestamp()
        );
    }
}
