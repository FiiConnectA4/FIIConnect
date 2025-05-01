package com.fiiconnect.api.auth_userMgmt.controllers;

import com.fiiconnect.api.auth_userMgmt.core.ApiResponse;
import com.fiiconnect.api.auth_userMgmt.dtos.LoginRequest;
import com.fiiconnect.api.auth_userMgmt.dtos.RegisterRequest;
import com.fiiconnect.api.auth_userMgmt.models.Role;
import com.fiiconnect.api.auth_userMgmt.models.User;
import com.fiiconnect.api.auth_userMgmt.repositories.RoleRepository;
import com.fiiconnect.api.auth_userMgmt.repositories.UserRepository;
import com.fiiconnect.api.auth_userMgmt.core.ApiResponse;
import com.fiiconnect.api.auth_userMgmt.core.AuthResponse;
import com.fiiconnect.api.auth_userMgmt.services.JwtService;
import com.fiiconnect.api.auth_userMgmt.services.TwoFactorAuthenticationService;
import com.fiiconnect.api.auth_userMgmt.validators.EmailValidator;
import com.fiiconnect.api.auth_userMgmt.validators.IbanValidator;
import com.fiiconnect.api.auth_userMgmt.validators.PasswordValidator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TwoFactorAuthenticationService twoFactorAuthenticationService;

    @Autowired
    private JwtService jwtService;

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

            System.out.println("Rol căutat: ROLE_" + registerRequest.getRole().toUpperCase());
            Role role = roleRepository.findByRoleName("ROLE_" + registerRequest.getRole().toUpperCase());
            System.out.println("Rol găsit: " + role);

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

            // Two Factor Authentication
            String secret = twoFactorAuthenticationService.generateSecretKey();
            user.setTwoFactorSecret(secret);

            userRepository.save(user);

            String qrUrl = twoFactorAuthenticationService.getQRCodeUrl(user.getEmail(), secret);

            return ResponseEntity.ok(new ApiResponse("Utilizator înregistrat cu succes. Scanează acest QR în Google Authenticator: " + qrUrl, true));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body(
                    new ApiResponse("Eroare internă: " + e.getMessage(), false));
        }
    }

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userRepository.findById(id).orElseThrow();
    }

    @GetMapping("/login")
    public ResponseEntity<ApiResponse> testLogin() {
        return ResponseEntity.ok(new ApiResponse("Ești autentificat!", true));
    }

    @PostMapping("/login/init")
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

        // Generăm tokenul si trimitem
        String jwtToken = jwtService.generateToken(user.getUsername());
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

        // Generăm tokenul si trimitem
        String jwtToken = jwtService.generateToken(user.getUsername());
        return ResponseEntity.ok(new AuthResponse(jwtToken));
    }
}
