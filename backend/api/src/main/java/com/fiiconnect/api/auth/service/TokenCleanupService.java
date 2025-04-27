package com.fiiconnect.api.auth.service;

import com.fiiconnect.api.passwordreset.model.PasswordResetToken;
import com.fiiconnect.api.passwordreset.repository.PasswordResetTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TokenCleanupService {

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Scheduled(fixedRate = 3600000) // 1 oră în milisecunde
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
