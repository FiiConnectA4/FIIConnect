package com.fiiconnect.api.auth_userMgmt.controllers;

import com.fiiconnect.api.auth_userMgmt.dtos.notificationDTO.BulkNotificationRequest;
import com.fiiconnect.api.auth_userMgmt.dtos.notificationDTO.NotificationResponse;
import com.fiiconnect.api.auth_userMgmt.exceptions.NotificationNotFoundException;
import com.fiiconnect.api.auth_userMgmt.exceptions.UserNotFoundException;
import com.fiiconnect.api.auth_userMgmt.models.User;
import com.fiiconnect.api.auth_userMgmt.repositories.UserRepository;
import com.fiiconnect.api.auth_userMgmt.services.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.security.RolesAllowed;
import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;
    private final UserRepository userRepo;

    /**
     * [POST] /notifications/send
     * Trimite notificări bulk către o listă de useri.
     * Acces: ADMIN sau PROFESSOR.
     * Service-ul poate arunca UserNotFoundException sau alte erori pe bază de validări.
     */
    @PostMapping("/send")
    @RolesAllowed({"ADMIN", "PROFESSOR"})
    public ResponseEntity<List<NotificationResponse>> sendBulk(@RequestBody BulkNotificationRequest req) {
        // Dacă unul dintre recipientIds nu există, service va arunca UserNotFoundException
        List<NotificationResponse> dtos = notificationService.sendBulk(req);
        return ResponseEntity.ok(dtos);
    }

    /**
     * [DELETE] /notifications/{id}
     * Șterge o singură notificare după ID.
     * Acces: doar utilizatorul care deține notificarea sau un ADMIN/PROFESOR.
     * Service-ul poate arunca NotificationNotFoundException (→ 404) sau AccessDeniedException (→ 403).
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotification(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        // Dacă notificarea nu există, service va arunca NotificationNotFoundException
        // Dacă utilizatorul nu are permisiunea, se aruncă AccessDeniedException
        notificationService.deleteNotificationById(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }

    /**
     * [DELETE] /notifications/user/{userId}
     * Șterge toate notificările asociate unui utilizator.
     * Acces: doar ADMIN / PROFESSOR
     * Service-ul poate arunca UserNotFoundException (→ 404).
     */
    @DeleteMapping("/user/{userId}")
    @RolesAllowed({"ADMIN", "PROFESSOR"})
    public ResponseEntity<Void> deleteAllByUser(@PathVariable Long userId) {
        // Dacă user-ul cu userId nu există, service aruncă UserNotFoundException
        notificationService.deleteAllNotificationsForUser(userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * [GET] /notifications/unread
     * Returnează toate notificările necitite ale utilizatorului autentificat.
     * Acces: orice utilizator autentificat.
     * Dacă user-ul nu există, aruncă UserNotFoundException (→ 404).
     */
    @GetMapping("/unread")
    public ResponseEntity<List<NotificationResponse>> getUnread(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        User user = userRepo.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new UserNotFoundException(userDetails.getUsername()));
        List<NotificationResponse> dtos = notificationService.getUnreadNotifications(user);
        return ResponseEntity.ok(dtos);
    }

    /**
     * [PUT] /notifications/{id}/read
     * Marchează o notificare ca „read” (citită).
     * Acces: doar utilizatorul care deține notificarea sau ADMIN/PROFESOR.
     * Service-ul poate arunca NotificationNotFoundException (→ 404) sau AccessDeniedException (→ 403).
     */
    @PutMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        notificationService.markAsRead(id, userDetails.getUsername());
        return ResponseEntity.ok().build();
    }

    /**
     * [GET] /notifications?limit={limit}&read={true|false}
     * Returnează notificări filtrate după starea „read” (dacă e specificat) și limitate la 'limit' intrări.
     * Rezultatele sunt ordonate descrescător după timestamp.
     * Acces: doar utilizatorul care le primește.
     * Dacă user-ul nu există, aruncă UserNotFoundException (→ 404).
     */
    @GetMapping
    public ResponseEntity<List<NotificationResponse>> getLimitedNotifications(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "10") int limit,
            @RequestParam(required = false) Boolean read
    ) {
        User user = userRepo.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new UserNotFoundException(userDetails.getUsername()));
        List<NotificationResponse> dtos =
                notificationService.getLimitedNotifications(user, limit, read);
        return ResponseEntity.ok(dtos);
    }
}
