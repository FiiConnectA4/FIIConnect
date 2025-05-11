package com.fiiconnect.api.auth_userMgmt.services;

import com.fiiconnect.api.auth_userMgmt.models.PasswordResetToken;
import com.fiiconnect.api.auth_userMgmt.repositories.PasswordResetTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TokenCleanupService {

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Scheduled(fixedRate = 3600000)
    public void cleanupExpiredTokens() {
        List<PasswordResetToken> tokens = tokenRepository.findAll();
        LocalDateTime now = LocalDateTime.now();

        for (PasswordResetToken token : tokens) {
            if (token.getExpirationDate().isBefore(now)) {
                tokenRepository.delete(token);
            }
        }
        System.out.println("Token-uri expirate șterse la ora: " + now);
    }
}
