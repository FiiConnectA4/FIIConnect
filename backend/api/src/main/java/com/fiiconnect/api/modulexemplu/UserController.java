package com.fiiconnect.api.modulexemplu;

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
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            if (user.getPassword() == null || user.getUsername() == null) {
                return ResponseEntity.badRequest().body("Username și parola sunt necesare.");
            }
            if (userRepository.findByEmail(user.getEmail()) != null) {
                return ResponseEntity.badRequest().body("Emailul este deja folosit.");
            }

            user.setPassword(passwordEncoder.encode(user.getPassword()));
            User saved = userRepository.save(user);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            e.printStackTrace(); // vezi consola
            return ResponseEntity.status(500).body("Eroare internă: " + e.getMessage());
        }
    }

    // ✅ Obține toți utilizatorii
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Long id) {
        return userRepository.findById(id).orElseThrow();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername());

        if (user == null) {
            return ResponseEntity.status(401).body("User inexistent.");
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Parolă greșită.");
        }

        return ResponseEntity.ok("Login reușit!");
    }

}