package com.fiiconnect.api.auth.controller;

import com.fiiconnect.api.auth.validator.EmailValidator;
import com.fiiconnect.api.core.ApiResponse;
import com.fiiconnect.api.auth.validator.PasswordValidator;
import com.fiiconnect.api.auth.model.User;
import com.fiiconnect.api.auth.repository.UserRepository;
import com.fiiconnect.api.auth.service.TwoFactorAuthenticationService;
import com.fiiconnect.api.auth.dto.LoginRequest;
import com.fiiconnect.api.auth.dto.RegisterRequest;
import com.fiiconnect.api.permissions.model.Role;
import com.fiiconnect.api.permissions.repository.RoleRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TwoFactorAuthenticationService twoFactorAuthenticationService;

    @Autowired
    private RoleRepository roleRepository;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> registerUser(@RequestBody RegisterRequest request) {
        try {
            if (request.getPassword() == null || request.getUsername() == null || request.getEmail() == null || request.getRoleName() == null) {
                return ResponseEntity.badRequest().body(
                        new ApiResponse("Username, email, parola și rolul sunt necesare.", false));
            }

            if (userRepository.findByEmail(request.getEmail()) != null) {
                return ResponseEntity.badRequest().body(
                        new ApiResponse("Emailul este deja folosit.", false));
            }

            if (!PasswordValidator.isValid(request.getPassword())) {
                return ResponseEntity.badRequest().body(
                        new ApiResponse("Parola trebuie să conțină minim 8 caractere, o literă mare, una mică, o cifră și un simbol.", false));
            }

            if (!EmailValidator.isValid(request.getEmail())) {
                return ResponseEntity.badRequest().body(
                        new ApiResponse("Email invalid.", false));
            }

            if (userRepository.findByUsername(request.getUsername()) != null) {
                return ResponseEntity.badRequest().body(
                        new ApiResponse("Username-ul este deja folosit.", false));
            }

            // Creăm user-ul
            User user = new User();
            user.setUsername(request.getUsername());
            user.setEmail(request.getEmail());
            user.setPassword(passwordEncoder.encode(request.getPassword()));

            // Căutăm rolul
            Role role = roleRepository.findByRoleName(request.getRoleName());
            if (role == null) {
                return ResponseEntity.badRequest().body(
                        new ApiResponse("Rolul specificat nu există.", false));
            }

            // Asignăm rolul la user
            user.getRoles().add(role);

            // Two Factor Authentication
            String secret = twoFactorAuthenticationService.generateSecretKey();
            user.setTwoFactorSecret(secret);

            userRepository.save(user);

            String qrUrl = twoFactorAuthenticationService.getQRCodeUrl(user.getEmail());

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

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(@RequestBody LoginRequest loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername());

        if (user == null) {
            return ResponseEntity.status(401).body(
                    new ApiResponse("User inexistent.", false));
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body(
                    new ApiResponse("Parolă greșită.", false));
        }

        // 2FA check
        if (user.getTwoFactorSecret() != null) {
            boolean is2FACodeValid = twoFactorAuthenticationService.verifyCode(user.getTwoFactorSecret(), loginRequest.getTwoFactorCode());
            if (!is2FACodeValid) {
                return ResponseEntity.status(401).body(
                        new ApiResponse("Cod 2FA invalid.", false));
            }
        }

        return ResponseEntity.ok(new ApiResponse("Login reușit!", true));
    }
}
