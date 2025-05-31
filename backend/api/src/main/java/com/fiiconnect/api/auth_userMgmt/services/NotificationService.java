package com.fiiconnect.api.auth_userMgmt.services;

import com.fiiconnect.api.auth_userMgmt.dtos.notificationDTO.BulkNotificationRequest;
import com.fiiconnect.api.auth_userMgmt.dtos.notificationDTO.NotificationResponse;
import com.fiiconnect.api.auth_userMgmt.exceptions.NotificationNotFoundException;
import com.fiiconnect.api.auth_userMgmt.exceptions.UserNotFoundException;
import com.fiiconnect.api.auth_userMgmt.models.Notification;
import com.fiiconnect.api.auth_userMgmt.models.User;
import com.fiiconnect.api.auth_userMgmt.repositories.NotificationRepository;
import com.fiiconnect.api.auth_userMgmt.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Conține toată logica de business pentru notificări:
 * - crearea (push + persistare)
 * - ștergerea (un singur ID sau toate notificările unui utilizator)
 * - marcarea ca citite
 * - preluarea notificărilor (necitite sau cu limită)
 */
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepo;
    private final UserRepository userRepo;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Creează o singură notificare, o salvează în baza de date și o trimite prin WebSocket direct către utilizatorul țintă.
     *
     * @param recipient  Utilizatorul care va primi notificarea
     * @param req        DTO conținând titlul, conținutul și (opțional) tipul notificării
     * @return DTO-ul aferent notificării create
     */
    @Transactional
    public NotificationResponse sendToOne(User recipient, BulkNotificationRequest req) {
        Notification notif = new Notification();
        notif.setRecipient(recipient);
        notif.setTitle(req.getTitle());
        notif.setContent(req.getContent());
        notif.setType(req.getType());
        notif.setRead(false);
        notif.setTimestamp(LocalDateTime.now());

        Notification saved = notificationRepo.save(notif);

        NotificationResponse dto = mapToDto(saved);
        // Push via WebSocket (destinația pentru un singur utilizator: /user/{username}/queue/notifications)
        messagingTemplate.convertAndSendToUser(
                recipient.getUsername(),
                "/queue/notifications",
                dto
        );

        return dto;
    }

    /**
     * Trimite notificări în bloc (bulk) către lista de utilizatori din req.getRecipientIds():
     * - creează entități Notification pentru fiecare utilizator
     * - salvează toate într-un singur apel saveAll(…)
     * - emite câte un mesaj WebSocket pentru fiecare destinatar
     *
     * @param req DTO care conține lista de recipientIds, titlu, conținut și tip
     * @return lista de DTO-uri aferente fiecărei notificări create
     */
    @Transactional
    public List<NotificationResponse> sendBulk(BulkNotificationRequest req) {
        // 1) Citește toți utilizatorii existenți în BD cu ID-urile furnizate
        List<User> recipients = userRepo.findAllById(req.getRecipientIds());

        // 2) Construește lista de entități Notification (fără a le salva încă)
        List<Notification> toPersist = recipients.stream()
                .map(u -> {
                    Notification n = new Notification();
                    n.setRecipient(u);
                    n.setTitle(req.getTitle());
                    n.setContent(req.getContent());
                    n.setType(req.getType());
                    n.setRead(false);
                    n.setTimestamp(LocalDateTime.now());
                    return n;
                })
                .collect(Collectors.toList());

        // 3) Salvează toate notificările într-un singur apel la DB
        List<Notification> savedAll = notificationRepo.saveAll(toPersist);

        // 4) Pentru fiecare entitate salvată, publică prin WS către user-ul respectiv
        return savedAll.stream()
                .map(n -> {
                    NotificationResponse dto = mapToDto(n);
                    messagingTemplate.convertAndSendToUser(
                            n.getRecipient().getUsername(),
                            "/queue/notifications",
                            dto
                    );
                    return dto;
                })
                .collect(Collectors.toList());
    }

    /**
     * Șterge o singură notificare după ID.
     * Dacă notificarea nu există, aruncă {@link NotificationNotFoundException} (→ 404).
     * Dacă utilizatorul care apelează nu este nici proprietarul notificării, nici ADMIN/PROFESOR,
     * aruncă {@link AccessDeniedException} (→ 403).
     *
     * @param id               ID-ul notificării care se șterge
     * @param requestingUsername Username-ul utilizatorului care apelează ștergerea
     */
    @Transactional
    public void deleteNotificationById(Long id, String requestingUsername) {
        Notification notif = notificationRepo.findById(id)
                .orElseThrow(() -> new NotificationNotFoundException(id));

        // Verifică dacă user-ul curent are dreptul de a șterge
        String recipientUsername = notif.getRecipient().getUsername();
        if (!recipientUsername.equals(requestingUsername)
                && !hasRole(requestingUsername, "ADMIN")
                && !hasRole(requestingUsername, "PROFESSOR")) {
            throw new AccessDeniedException("Nu aveți permisiunea de a șterge această notificare.");
        }

        notificationRepo.deleteById(id);
    }

    /**
     * Șterge toate notificările asociate unui utilizator (userId).
     * Dacă utilizatorul cu acel ID nu există, se aruncă {@link UserNotFoundException} (→ 404).
     * Acces: doar ADMIN / PROFESSOR (verificat de Controller prin @RolesAllowed).
     *
     * @param userId ID-ul utilizatorului pentru care se șterg toate notificările
     */
    @Transactional
    public void deleteAllNotificationsForUser(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(userId));
        List<Notification> toDelete = notificationRepo.findByRecipient(user);
        notificationRepo.deleteAll(toDelete);
    }

    // --- restul metodelor din NotificationService (sendBulk, getUnread, markAsRead etc.) ---

    // Metodă ajutătoare pentru validarea rolurilor
    private boolean hasRole(String username, String roleName) {
        User u = userRepo.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username));
        return u.getRoles().stream()
                .anyMatch(r -> r.getRoleName().equals(roleName));
    }

    /**
     * Exemplu de metodă existentă în serviciu: marchează notificarea ca read.
     */
    @Transactional
    public void markAsRead(Long id, String requestingUsername) {
        Notification notif = notificationRepo.findById(id)
                .orElseThrow(() -> new NotificationNotFoundException(id));

        if (!notif.getRecipient().getUsername().equals(requestingUsername)
                && !hasRole(requestingUsername, "ADMIN")
                && !hasRole(requestingUsername, "PROFESSOR")) {
            throw new AccessDeniedException("Nu aveți permisiunea de a marca această notificare ca citită.");
        }

        notif.setRead(true);
        notificationRepo.save(notif);
    }

    /**
     * Șterge o singură notificare cu ID-ul specificat.
     *
     * @param id ID-ul notificării care se va șterge
     * @throws RuntimeException dacă notificarea nu există
     */
    @Transactional
    public void deleteNotification(Long id) {
        if (!notificationRepo.existsById(id)) {
            throw new RuntimeException("Notificarea cu ID " + id + " nu a fost găsită.");
        }
        notificationRepo.deleteById(id);
    }

    /**
     * Șterge toate notificările asociate utilizatorului cu ID-ul specificat.
     *
     * @param userId ID-ul utilizatorului
     * @throws RuntimeException dacă utilizatorul nu există
     */
    @Transactional
    public void deleteAllByUserId(Long userId) {
        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilizatorul cu ID " + userId + " nu a fost găsit"));
        List<Notification> toDelete = notificationRepo.findByRecipient(user);
        notificationRepo.deleteAll(toDelete);
    }

    /**
     * Returnează lista notificărilor necitite (read = false) pentru utilizatorul dat.
     *
     * @param user Utilizatorul autentificat
     * @return listă de NotificationResponse DTO
     */
    @Transactional(readOnly = true)
    public List<NotificationResponse> getUnreadNotifications(User user) {
        List<Notification> unread = notificationRepo.findByRecipientAndReadFalse(user);
        return unread.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Returnează notificări filtrate după starea „read” (dacă nu e null) și limitate la 'limit' intrări.
     * Rezultatele sunt ordonate descrescător după timestamp (ultimele notificări primele).
     *
     * @param user       Utilizatorul autentificat
     * @param limit      Numărul maxim de notificări returnate
     * @param readStatus Dacă true → returnează doar cele citite; dacă false → doar cele necitite; dacă null → toate
     * @return lista de NotificationResponse DTO
     */
    @Transactional(readOnly = true)
    public List<NotificationResponse> getLimitedNotifications(User user, int limit, Boolean readStatus) {
        Pageable pageable = PageRequest.of(0, limit, Sort.by("timestamp").descending());
        List<Notification> notifications;

        if (readStatus != null) {
            notifications = notificationRepo.findByRecipientAndRead(user, readStatus, pageable);
        } else {
            notifications = notificationRepo.findByRecipient(user, pageable);
        }

        return notifications.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // Conversie internă Notification → NotificationResponse
    private NotificationResponse mapToDto(Notification n) {
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
