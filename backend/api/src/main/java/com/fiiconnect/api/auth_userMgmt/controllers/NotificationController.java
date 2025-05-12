package com.fiiconnect.api.auth_userMgmt.controllers;

import com.fiiconnect.api.auth_userMgmt.dtos.NotificationRequest;
import com.fiiconnect.api.auth_userMgmt.dtos.NotificationResponse;
import com.fiiconnect.api.auth_userMgmt.models.User;
import com.fiiconnect.api.auth_userMgmt.repositories.UserRepository;
import com.fiiconnect.api.auth_userMgmt.models.Notification;
import com.fiiconnect.api.auth_userMgmt.repositories.NotificationRepository;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/notifications")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @PostMapping("/send/{userId}")
    @RolesAllowed("ROLE_ADMIN")
    public ResponseEntity<?> sendNotification(
            @PathVariable Long userId,
            @RequestBody NotificationRequest req
    ) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Notification notif = new Notification();
        notif.setRecipient(user);
        notif.setTitle(req.getTitle());
        notif.setContent(req.getContent());
        notif.setType(req.getType());
        notif.setTimestamp(LocalDateTime.now());

        notificationRepo.save(notif);

        NotificationResponse dto = mapToDto(notif);

        // WebSocket push to specific user
        messagingTemplate.convertAndSendToUser(
                user.getUsername(),
                "/queue/notifications",
                dto
        );

        return ResponseEntity.ok(dto);
    }

    @GetMapping("/unread")
    public ResponseEntity<?> getUnread(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepo.findByUsername(userDetails.getUsername());

        List<NotificationResponse> dtos = notificationRepo
                .findByRecipientAndReadFalse(user)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        Notification notif = notificationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));
        notif.setRead(true);
        notificationRepo.save(notif);
        return ResponseEntity.ok().build();
    }

    private NotificationResponse mapToDto(Notification notif) {
        return new NotificationResponse(
                notif.getId(),
                notif.getTitle(),
                notif.getContent(),
                notif.getType(),
                notif.isRead(),
                notif.getTimestamp()
        );
    }
}
