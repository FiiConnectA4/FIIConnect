package com.fiiconnect.api.auth_userMgmt.controllers;

import com.fiiconnect.api.auth_userMgmt.dtos.BulkNotificationRequest;
import com.fiiconnect.api.auth_userMgmt.dtos.NotificationRequest;
import com.fiiconnect.api.auth_userMgmt.dtos.NotificationResponse;
import com.fiiconnect.api.auth_userMgmt.models.User;
import com.fiiconnect.api.auth_userMgmt.repositories.UserRepository;
import com.fiiconnect.api.auth_userMgmt.models.Notification;
import com.fiiconnect.api.auth_userMgmt.repositories.NotificationRepository;
import com.fiiconnect.api.auth_userMgmt.services.NotificationService;
import jakarta.annotation.security.RolesAllowed;
import lombok.RequiredArgsConstructor;
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
@RequiredArgsConstructor
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    private final NotificationService notificationService;

    @PostMapping("/send")
    @RolesAllowed({"ADMIN", "PROFESSOR"})
    public ResponseEntity<List<NotificationResponse>> sendBulk(
            @RequestBody BulkNotificationRequest req) {

        List<NotificationResponse> dtos = notificationService.sendBulk(req);
        return ResponseEntity.ok(dtos);
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
