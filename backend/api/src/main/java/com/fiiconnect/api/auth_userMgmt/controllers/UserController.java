package com.fiiconnect.api.auth_userMgmt.controllers;

import com.fiiconnect.api.auth_userMgmt.core.ApiResponse;
import com.fiiconnect.api.auth_userMgmt.dtos.LoginRequest;
import com.fiiconnect.api.auth_userMgmt.dtos.RegisterRequest;
import com.fiiconnect.api.auth_userMgmt.models.Role;
import com.fiiconnect.api.auth_userMgmt.models.User;
import com.fiiconnect.api.auth_userMgmt.repositories.RoleRepository;
import com.fiiconnect.api.auth_userMgmt.repositories.UserRepository;
import com.fiiconnect.api.auth_userMgmt.services.EmailService;
import com.fiiconnect.api.auth_userMgmt.core.AuthResponse;
import com.fiiconnect.api.auth_userMgmt.services.JwtService;
import com.fiiconnect.api.auth_userMgmt.services.TwoFactorAuthenticationService;
import com.fiiconnect.api.auth_userMgmt.validators.EmailValidator;
import com.fiiconnect.api.auth_userMgmt.validators.IbanValidator;
import com.fiiconnect.api.auth_userMgmt.validators.PasswordValidator;
import com.fiiconnect.api.auth_userMgmt.models.PasswordResetToken;
import com.fiiconnect.api.auth_userMgmt.repositories.PasswordResetTokenRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TwoFactorAuthenticationService twoFactorAuthenticationService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private EmailService emailService;

    @GetMapping("/role")
    public ResponseEntity<?> getRoles() {
        List<Role> roles = roleRepository.findAll();
        return ResponseEntity.ok(roles);
    }

    @PostMapping("/role")
    public ResponseEntity<?> createRole(@RequestBody Role role) {
        if (roleRepository.findByRoleName(role.getRoleName()) != null) {
            return ResponseEntity.badRequest().body("Rolul există deja.");
        }
        roleRepository.save(role);
        return ResponseEntity.ok(role);
    }


    // Test Token Repository
    @PostConstruct
    public void testTokenRepo() {
        tokenRepository.count();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        Optional<User> userOptional = Optional.ofNullable(userRepository.findByEmail(email));
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = userOptional.get();
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpirationDate(LocalDateTime.now().plusMinutes(30));
        tokenRepository.save(resetToken);

        // Link pentru email
        String resetLink = "http://localhost:34101/reset-password?token=" + token;

        // Trimite email
        emailService.sendResetPasswordEmail(email, token);

        return ResponseEntity.ok("Link-ul de resetare a fost trimis pe email.");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam String token, @RequestParam String newPassword) {
        Optional<PasswordResetToken> resetTokenOptional = tokenRepository.findByToken(token);

        if (resetTokenOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid token");
        }

        PasswordResetToken resetToken = resetTokenOptional.get();

        if (resetToken.getExpirationDate().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body("Token expired");
        }

        User user = resetToken.getUser();

        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            return ResponseEntity.badRequest().body("Noua parolă nu poate fi aceeași cu parola curentă.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        tokenRepository.delete(resetToken);

        return ResponseEntity.ok("Password reset successfully");
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> registerUser(@RequestBody RegisterRequest registerRequest) {
        try {
            if (registerRequest.getUsername() == null || registerRequest.getPassword() == null || registerRequest.getEmail() == null || registerRequest.getRole() == null) {
                return ResponseEntity.badRequest().body(
                        new ApiResponse("Username, email, parola și rolul sunt necesare.", false));
            }

            if (userRepository.findByEmail(registerRequest.getEmail()) != null) {
                return ResponseEntity.badRequest().body(
                        new ApiResponse("Emailul este deja folosit.", false));
            }

            if (!PasswordValidator.isValid(registerRequest.getPassword())) {
                return ResponseEntity.badRequest().body(
                        new ApiResponse("Parola trebuie să conțină minim 8 caractere, o literă mare, una mică, o cifră și un simbol.", false));
            }

            if (!EmailValidator.isValid(registerRequest.getEmail())) {
                return ResponseEntity.badRequest().body(
                        new ApiResponse("Email invalid.", false));
            }

            if (userRepository.findByUsername(registerRequest.getUsername()) != null) {
                return ResponseEntity.badRequest().body(
                        new ApiResponse("Username-ul este deja folosit.", false));
            }

            Role role = roleRepository.findByRoleName("ROLE_" + registerRequest.getRole().toUpperCase());
            if (role == null) {
                return ResponseEntity.badRequest().body(
                        new ApiResponse("Rol invalid. Roluri posibile: STUDENT sau PROFESOR.", false));
            }

            if (registerRequest.getIban() != null && !registerRequest.getIban().isEmpty()) {
                if (!IbanValidator.isValid(registerRequest.getIban())) {
                    return ResponseEntity.badRequest().body(
                            new ApiResponse("IBAN invalid.", false));
                }
            }

            // Creăm user-ul
            User user = new User();
            user.setUsername(registerRequest.getUsername());
            user.setEmail(registerRequest.getEmail());
            user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            user.getRoles().add(role);
            user.setIban(registerRequest.getIban());
            user.setActive(true);


            //Two Factor Authentication - currently off
            //String secret = twoFactorAuthenticationService.generateSecretKey();
            //user.setTwoFactorSecret(secret);

            user.setTwoFactorSecret(null);
            userRepository.save(user);

            //String qrUrl = twoFactorAuthenticationService.getQRCodeUrl(user.getEmail(), secret);

            //return ResponseEntity.ok(new ApiResponse("Utilizator înregistrat cu succes. Scanează acest QR în Google Authenticator: " + qrUrl, true));
            return ResponseEntity.ok(new ApiResponse("Register successful. Username: " + registerRequest.getUsername() + ", Password: " + registerRequest.getPassword(), true));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(
                    new ApiResponse("Eroare internă: " + e.getMessage(), false));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername());

        if (user == null) {
            return ResponseEntity.status(401).body(
                    new ApiResponse("User inexistent.", false));
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body(
                    new ApiResponse("Parolă greșită.", false));
        }

        if (user.getTwoFactorSecret() != null) {
            return ResponseEntity.ok(new ApiResponse("2FA_REQUIRED", true));
        }

        // Extrage rolurile utilizatorului
        List<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getRoleName()))
                .collect(Collectors.toList());

        // Generăm token-ul cu rolurile
        String jwtToken = jwtService.generateToken(user.getUsername(), authorities);

        return ResponseEntity.ok(new AuthResponse(jwtToken));
    }

    @PostMapping("/login/verify")
    public ResponseEntity<?> verifyTwoFactor(@RequestBody LoginRequest loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername());

        if (user == null || user.getTwoFactorSecret() == null) {
            return ResponseEntity.status(401).body(
                    new ApiResponse("Autentificare invalidă.", false));
        }

        boolean is2FACodeValid = twoFactorAuthenticationService.verifyCode(
                user.getTwoFactorSecret(),
                loginRequest.getTwoFactorCode()
        );

        if (!is2FACodeValid) {
            return ResponseEntity.status(401).body(
                    new ApiResponse("Cod 2FA invalid.", false));
        }

        // Extrage rolurile utilizatorului
        List<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getRoleName()))
                .collect(Collectors.toList());

        // Generăm token-ul cu rolurile
        String jwtToken = jwtService.generateToken(user.getUsername(), authorities);

        return ResponseEntity.ok(new AuthResponse(jwtToken));
    }

}
