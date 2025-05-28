package com.fiiconnect.api.auth_userMgmt.controllers;

import com.fiiconnect.api.auth_userMgmt.core.ApiResponse;
import com.fiiconnect.api.auth_userMgmt.dtos.LoginDTO;
import com.fiiconnect.api.auth_userMgmt.dtos.RegisterDTO;
import com.fiiconnect.api.auth_userMgmt.models.Role;
import com.fiiconnect.api.auth_userMgmt.models.User;
import com.fiiconnect.api.auth_userMgmt.models.UserProfile;
import com.fiiconnect.api.auth_userMgmt.repositories.RoleRepository;
import com.fiiconnect.api.auth_userMgmt.repositories.UserProfileRepository;
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
import com.fiiconnect.api.didactic.models.Professor;
import com.fiiconnect.api.didactic.models.Student;
import com.fiiconnect.api.didactic.repositories.ProfessorRepository;
import com.fiiconnect.api.didactic.repositories.StudentRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
public class AuthController {

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

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    // Test Token Repository
    @PostConstruct
    public void testTokenRepo() {
        tokenRepository.count();
    }

    @PostMapping("/2fa/start")
    public ResponseEntity<?> start2FA(@RequestHeader("Authorization") String authHeader) {
        User user = validateAndGetUser(authHeader);
        if (user.isTwoFactorEnabled())
            return ResponseEntity.badRequest().body(new ApiResponse("2FA este deja activ.", false));

        String secret = twoFactorAuthenticationService.generateSecretKey();
        user.setPendingTwoFactorSecret(secret);
        userRepository.save(user);

        String qrUrl = twoFactorAuthenticationService.getQRCodeUrl(user.getEmail(), secret);
        return ResponseEntity.ok(Map.of("qrUrl", qrUrl, "secret", secret));
    }

    @PostMapping("/2fa/confirm")
    public ResponseEntity<?> confirm2FA(@RequestHeader("Authorization") String authHeader,
                                        @RequestBody Map<String,String> body) {
        User user = validateAndGetUser(authHeader);
        String code = body.get("code");

        String pending = user.getPendingTwoFactorSecret();
        if (pending == null)
            return ResponseEntity.badRequest().body(new ApiResponse("Nu ai început configurarea 2FA.", false));

        if (!twoFactorAuthenticationService.verifyCode(pending, code))
            return ResponseEntity.status(401).body(new ApiResponse("Cod 2FA invalid.", false));

        user.setTwoFactorSecret(pending);
        user.setPendingTwoFactorSecret(null);
        user.setTwoFactorEnabled(true);

        UserProfile profile = user.getProfile();
        if (profile != null) {
            profile.setTwoFactorEnabled(true);
            userProfileRepository.save(profile);
        }

        userRepository.save(user);
        return ResponseEntity.ok(new ApiResponse("2FA activat!", true));
    }

    @PostMapping("/2fa/cancel")
    public ResponseEntity<?> cancel2FA(@RequestHeader("Authorization") String authHeader) {
        User user = validateAndGetUser(authHeader);
        user.setPendingTwoFactorSecret(null);
        userRepository.save(user);
        return ResponseEntity.ok(new ApiResponse("Setup 2FA anulat.", true));
    }

    private User validateAndGetUser(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer "))
            throw new RuntimeException("Token lipsă");
        String username = jwtService.extractUsername(authHeader.substring(7));
        return Optional.ofNullable(userRepository.findByUsername(username))
                .orElseThrow(() -> new RuntimeException("User inexistent"));
    }

    @PostMapping("/disable-2fa")
    public ResponseEntity<?> disable2FA(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body(new ApiResponse("Token lipsă sau invalid.", false));
        }

        String token = authHeader.substring(7);
        String username;
        try {
            username = jwtService.extractUsername(token);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse("Token invalid.", false));
        }

        User user = userRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(404).body(new ApiResponse("Utilizator inexistent.", false));
        }

        user.setTwoFactorSecret(null);
        user.setTwoFactorEnabled(false);


        UserProfile profile = user.getProfile();
        if (profile != null) {
            profile.setTwoFactorEnabled(false);
            userProfileRepository.save(profile);
        }

        userRepository.save(user);


        return ResponseEntity.ok(new ApiResponse("2FA a fost dezactivat cu succes.", true));
    }



    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        Optional<User> userOptional = Optional.ofNullable(userRepository.findByEmail(email));
        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = userOptional.get();
        tokenRepository.deleteByUser(user);

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

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestHeader("Authorization") String authHeader,
                                            @RequestBody Map<String, String> body) {
        User user = validateAndGetUser(authHeader);

        String oldPassword = body.get("oldPassword");
        String newPassword = body.get("newPassword");

        if (oldPassword == null || newPassword == null) {
            return ResponseEntity.badRequest().body(new ApiResponse("Ambele parole sunt necesare.", false));
        }

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            return ResponseEntity.status(401).body(new ApiResponse("Parola veche este incorectă.", false));
        }

        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            return ResponseEntity.badRequest().body(new ApiResponse("Noua parolă nu poate fi aceeași cu cea veche.", false));
        }

        if (!PasswordValidator.isValid(newPassword)) {
            return ResponseEntity.badRequest().body(
                    new ApiResponse("Parola trebuie să conțină minim 8 caractere, o literă mare, una mică, o cifră și un simbol.", false)
            );
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(new ApiResponse("Parola a fost schimbată cu succes.", true));
    }


    @PostMapping("/register")
    public ResponseEntity<ApiResponse> registerUser(@RequestBody RegisterDTO registerRequest) {
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

            //users
            User user = new User();
            user.setUsername(registerRequest.getUsername());
            user.setEmail(registerRequest.getEmail());
            user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            user.getRoles().add(role);
            user.setActive(true);
            user.setTwoFactorSecret(null);

            if (role.getRoleName().equals("ROLE_STUDENT")) {
                Student student = studentRepository.findById(registerRequest.getStudentId())
                        .orElseThrow(() -> new IllegalArgumentException("Studentul nu există"));
                user.setStudent(student);
            }


            if (role.getRoleName().equals("ROLE_PROFESOR")) {
                Professor prof = professorRepository.findById(registerRequest.getProfessorId())
                        .orElseThrow(() -> new IllegalArgumentException("Profesorul nu există"));
                user.setProfessor(prof);
            }

            userRepository.save(user);

            return ResponseEntity.ok(new ApiResponse("Register successful. Username: " + registerRequest.getUsername() + ", Password: " + registerRequest.getPassword(), true));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(
                    new ApiResponse("Eroare internă: " + e.getMessage(), false));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername());

        if (user == null) {
            return ResponseEntity.status(401).body(
                    new ApiResponse("User inexistent.", false));
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body(
                    new ApiResponse("Parolă greșită.", false));
        }

        if (user.isTwoFactorEnabled()) {
            return ResponseEntity.ok(new ApiResponse("2FA_REQUIRED", true));
        }

        user.setActive(true);
        userRepository.save(user);

        List<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getRoleName()))
                .collect(Collectors.toList());

        String jwtToken = jwtService.generateToken(user.getUsername(), authorities);

        return ResponseEntity.ok(new AuthResponse(jwtToken));
    }

    @PostMapping("/login/verify")
    public ResponseEntity<?> verifyTwoFactor(@RequestBody LoginDTO loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername());

        if (user == null || !user.isTwoFactorEnabled() || user.getTwoFactorSecret() == null) {
            return ResponseEntity.status(401)
                    .body(new ApiResponse("2FA nu e activat.", false));
        }

        boolean ok = twoFactorAuthenticationService.verifyCode(
                user.getTwoFactorSecret(),
                loginRequest.getTwoFactorCode()
        );

        if (!ok) {
            return ResponseEntity.status(401)
                    .body(new ApiResponse("Cod 2FA invalid.", false));
        }

        user.setActive(true);
        userRepository.save(user);

        List<GrantedAuthority> authorities = user.getRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getRoleName()))
                .collect(Collectors.toList());

        String jwtToken = jwtService.generateToken(user.getUsername(), authorities);
        return ResponseEntity.ok(new AuthResponse(jwtToken));
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body(new ApiResponse("Token invalid sau lipsă.", false));
        }

        String token = authHeader.substring(7);
        String username;
        try {
            username = jwtService.extractUsername(token);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse("Token invalid.", false));
        }

        User user = userRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(404).body(new ApiResponse("Utilizator inexistent.", false));
        }

        user.setActive(false);
        userRepository.save(user);

        return ResponseEntity.ok(new ApiResponse("Utilizator delogat și dezactivat.", true));
    }

}
