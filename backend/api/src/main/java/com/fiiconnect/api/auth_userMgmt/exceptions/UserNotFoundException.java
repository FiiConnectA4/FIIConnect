package com.fiiconnect.api.auth_userMgmt.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Aruncată când un User cu username-ul sau ID-ul specificat nu este găsit în baza de date.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
public class UserNotFoundException extends RuntimeException {
    public UserNotFoundException(String username) {
        super("Utilizatorul cu username-ul \"" + username + "\" nu a fost găsit.");
    }
    public UserNotFoundException(Long userId) {
        super("Utilizatorul cu ID-ul " + userId + " nu a fost găsit.");
    }
}
