package com.fiiconnect.api.auth_userMgmt.controllers;

import com.fiiconnect.api.auth_userMgmt.dtos.NotificationRequest;
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

@RestController
@RequestMapping("/api/notifications")
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

        // WebSocket push to specific user
        messagingTemplate.convertAndSendToUser(
                user.getUsername(), // must match Principal.getName()
                "/queue/notifications",
                notif
        );

        return ResponseEntity.ok("Sent");
    }

    @GetMapping("/unread")
    public ResponseEntity<?> getUnread(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepo.findByUsername(userDetails.getUsername());
        return ResponseEntity.ok(notificationRepo.findByRecipientAndReadFalse(user));
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        Notification notif = notificationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));
        notif.setRead(true);
        notificationRepo.save(notif);
        return ResponseEntity.ok().build();
    }
}
