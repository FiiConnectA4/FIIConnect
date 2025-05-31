package com.fiiconnect.api.auth_userMgmt.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Aruncată când un utilizator încearcă să acceseze/ștergă/modifice o notificare care nu îi aparține
 * și nu are rol ADMIN/PROFESSOR.
 */
@ResponseStatus(HttpStatus.FORBIDDEN)
public class NotificationAccessDeniedException extends RuntimeException {
    public NotificationAccessDeniedException(Long notifId) {
        super("Nu aveți permisiunea de a accesa/șterge/actualiza notificarea cu ID " + notifId + ".");
    }
}
