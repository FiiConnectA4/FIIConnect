package com.fiiconnect.api.auth_userMgmt.controllers;

import com.fiiconnect.api.auth_userMgmt.core.ApiResponse;
import com.fiiconnect.api.auth_userMgmt.dtos.RegisterRequest;
import com.fiiconnect.api.auth_userMgmt.models.Role;
import com.fiiconnect.api.auth_userMgmt.models.User;
import com.fiiconnect.api.auth_userMgmt.repositories.RoleRepository;
import com.fiiconnect.api.auth_userMgmt.repositories.UserRepository;
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

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> registerUser(@RequestBody User user) {
        try {
            if (user.getPassword() == null || user.getUsername() == null || user.getEmail() == null) {
                return ResponseEntity.badRequest().body(
                        new ApiResponse("Username, email și parola sunt necesare.", false));
            }

            if (userRepository.findByEmail(user.getEmail()) != null) {
                return ResponseEntity.badRequest().body(
                        new ApiResponse("Emailul este deja folosit.", false));
            }

            if (!PasswordValidator.isValid(user.getPassword())) {
                return ResponseEntity.badRequest().body(
                        new ApiResponse("Parola trebuie să conțină minim 8 caractere, o literă mare, una mică, o cifră și un simbol.", false));
            }

            if (!EmailValidator.isValid(user.getEmail())) {
                return ResponseEntity.badRequest().body(
                        new ApiResponse("Email invalid.", false));
            }

            if (userRepository.findByUsername(user.getUsername()) != null) {
                return ResponseEntity.badRequest().body(
                        new ApiResponse("Username-ul este deja folosit.", false));
            }

            if (user.getIban() != null && !user.getIban().isEmpty()) {
                if (!IbanValidator.isValid(user.getIban())) {
                    return ResponseEntity.badRequest().body(
                            new ApiResponse("IBAN invalid.", false));
                }
            }

            userRepository.save(user);

            return ResponseEntity.ok(new ApiResponse("Utilizator înregistrat cu succes.", true));

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
    public ResponseEntity<ApiResponse> login(@RequestBody User loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername());

        if (user == null) {
            return ResponseEntity.status(401).body(
                    new ApiResponse("User inexistent.", false));
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body(
                    new ApiResponse("Parolă greșită.", false));
        }

        return ResponseEntity.ok(new ApiResponse("Login reușit!", true));
    }
}
