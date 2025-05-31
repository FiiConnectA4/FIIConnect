package com.fiiconnect.api.auth_userMgmt.controllers.websocket;

import com.fiiconnect.api.auth_userMgmt.exceptions.UserNotFoundException;
import com.fiiconnect.api.auth_userMgmt.models.Notification;
import com.fiiconnect.api.auth_userMgmt.models.User;
import com.fiiconnect.api.auth_userMgmt.repositories.NotificationRepository;
import com.fiiconnect.api.auth_userMgmt.repositories.UserRepository;
import jakarta.annotation.security.RolesAllowed;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.time.LocalDateTime;

@Controller
public class NotificationWebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    /**
     * Primește un mesaj pe WebSocket și trimite notificare doar către utilizatorul conectat.
     * Poate fi apelat de frontend cu publish către /app/notify-test
     */
    @MessageMapping("/notify-test")
    public void testNotify(Principal principal, String message) {
        String username = principal.getName();
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username));

        if (user == null) {
            return;
        }

        Notification notif = new Notification();
        notif.setTitle("Notificare de test");
        notif.setContent(message != null ? message : "Aceasta este o notificare test.");
        notif.setType("INFO");
        notif.setRead(false);
        notif.setTimestamp(LocalDateTime.now());
        notif.setRecipient(user);

        notificationRepository.save(notif);

        messagingTemplate.convertAndSendToUser(
                username,
                "/queue/notifications",
                notif
        );
    }
}
