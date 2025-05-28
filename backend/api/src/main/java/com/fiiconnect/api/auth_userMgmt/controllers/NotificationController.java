package com.fiiconnect.api.auth_userMgmt.controllers;

import com.fiiconnect.api.auth_userMgmt.dtos.BulkNotificationRequest;
import com.fiiconnect.api.auth_userMgmt.dtos.NotificationResponse;
import com.fiiconnect.api.auth_userMgmt.models.Notification;
import com.fiiconnect.api.auth_userMgmt.models.User;
import com.fiiconnect.api.auth_userMgmt.repositories.NotificationRepository;
import com.fiiconnect.api.auth_userMgmt.repositories.UserRepository;
import com.fiiconnect.api.auth_userMgmt.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.security.RolesAllowed;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepo;
    private final UserRepository userRepo;
    private final NotificationService notificationService;

    // ✅ [POST] Trimitere notificări bulk (ADMIN / PROFESSOR)
    @PostMapping("/send")
    @RolesAllowed({"ADMIN", "PROFESSOR"})
    public ResponseEntity<List<NotificationResponse>> sendBulk(@RequestBody BulkNotificationRequest req) {
        List<NotificationResponse> dtos = notificationService.sendBulk(req);
        return ResponseEntity.ok(dtos);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNotification(@PathVariable Long id) {
        if (!notificationRepo.existsById(id)) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Notificarea nu a fost găsită.");
        }

        notificationRepo.deleteById(id);
        return ResponseEntity.ok("Notificarea a fost ștearsă.");
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<String> deleteAllNotificationsByUser(@PathVariable Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilizatorul nu a fost găsit"));

        List<Notification> notifications = notificationRepo.findByRecipient(user);
        notificationRepo.deleteAll(notifications);

        return ResponseEntity.ok("Toate notificările au fost șterse pentru utilizator.");
    }



    // ✅ [GET] Toate notificările necitite ale utilizatorului autentificat
    @GetMapping("/unread")
    public ResponseEntity<List<NotificationResponse>> getUnread(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepo.findByUsername(userDetails.getUsername());

        List<NotificationResponse> dtos = notificationRepo
                .findByRecipientAndReadFalse(user)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    // ✅ [PUT] Marchează o notificare ca "citită"
    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        Notification notif = notificationRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));
        notif.setRead(true);
        notificationRepo.save(notif);
        return ResponseEntity.ok().build();
    }

    // ✅ [GET] Returnează notificări filtrate după `read` și limitate
    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getLimitedNotifications(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) Boolean read
    ) {
        User user = userRepo.findByUsername(userDetails.getUsername());
        List<NotificationResponse> dtos = notificationService.getLimitedNotifications(user, limit, read);
        return ResponseEntity.ok(dtos);
    }

    // 🔄 Conversie Notification → DTO
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
