package com.fiiconnect.api.auth.service;

import com.warrenstrange.googleauth.GoogleAuthenticator;
import com.warrenstrange.googleauth.GoogleAuthenticatorConfig;
import com.warrenstrange.googleauth.GoogleAuthenticatorKey;
import com.warrenstrange.googleauth.GoogleAuthenticatorQRGenerator;
import org.springframework.stereotype.Service;

@Service
public class TwoFactorAuthenticationService {

    private final GoogleAuthenticator gAuth;

    public TwoFactorAuthenticationService() {
        GoogleAuthenticatorConfig config = new GoogleAuthenticatorConfig.GoogleAuthenticatorConfigBuilder()
                .setTimeStepSizeInMillis(30_000)  // 30 sec default
                .setWindowSize(1)                 // Accept codes +- 1 timestep
                .build();
        this.gAuth = new GoogleAuthenticator(config);
    }

    // Generates a secret key for a new user
    public String generateSecretKey() {
        GoogleAuthenticatorKey key = gAuth.createCredentials();
        return key.getKey();
    }

    // Generates a QR code URL for scanning
    public String getQRCodeUrl(String userEmail, String secret) {
        return GoogleAuthenticatorQRGenerator.getOtpAuthURL("FiiConnectApp", userEmail, secret);
    }

    // Verifies the code entered by the user
    public boolean verifyCode(String secret, int verificationCode) {
        // Create a temporary authenticator for this secret
        GoogleAuthenticator tempAuth = new GoogleAuthenticator();
        return tempAuth.authorize(secret, verificationCode);
    }
}
