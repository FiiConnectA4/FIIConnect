package com.fiiconnect.api.auth_userMgmt.services;

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
                .setTimeStepSizeInMillis(30_000)
                .setWindowSize(5)
                .build();
        this.gAuth = new GoogleAuthenticator(config);
    }

    public String generateSecretKey() {
        GoogleAuthenticatorKey key = gAuth.createCredentials();
        return key.getKey();
    }

    public String getQRCodeUrl(String userEmail, String secret) {
        GoogleAuthenticatorKey key = new GoogleAuthenticatorKey.Builder(secret).build();
        return GoogleAuthenticatorQRGenerator.getOtpAuthURL("FiiConnectApp", userEmail, key);
    }


    public boolean verifyCode(String secret, int verificationCode) {
        return gAuth.authorize(secret, verificationCode);
    }
}

