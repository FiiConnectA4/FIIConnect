package com.fiiconnect.api.auth_userMgmt.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Aruncată când o Notification cu ID-ul specificat nu există.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class NotificationNotFoundException extends RuntimeException {
    public NotificationNotFoundException(Long id) {
        super("Notificarea cu ID-ul " + id + " nu a fost găsită.");
    }
}
