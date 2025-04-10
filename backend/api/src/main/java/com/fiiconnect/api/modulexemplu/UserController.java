package com.fiiconnect.api.modulexemplu;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.fiiconnect.api.modulexemplu.EmailValidator;
import com.fiiconnect.api.modulexemplu.PasswordValidator;

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
            if (user.getPassword() == null || user.getUsername() == null || user.getEmail() == null) {
                return ResponseEntity.badRequest().body("Username, email și parola sunt necesare.");
            }

            if (userRepository.findByEmail(user.getEmail()) != null) {
                return ResponseEntity.badRequest().body("Emailul este deja folosit.");
            }

            if (!PasswordValidator.isValid(user.getPassword())) {
                return ResponseEntity.badRequest().body(
                        "Parola trebuie să conțină minim 8 caractere, o literă mare, una mică, o cifră și un simbol.");
            }

            if (!EmailValidator.isValid(user.getEmail())) {
                return ResponseEntity.badRequest().body("Email invalid.");
            }

            user.setPassword(passwordEncoder.encode(user.getPassword()));
            User saved = userRepository.save(user);
            return ResponseEntity.ok(saved);

        } catch (Exception e) {
            e.printStackTrace();
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

    @GetMapping("/login")
    public ResponseEntity<?> testLogin() {
        return ResponseEntity.ok("Ești autentificat!");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername());

        if (user == null) {
            return ResponseEntity.status(401).body(new ApiResponse("User inexistent.", false));
        }

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body(new ApiResponse("Parolă greșită.", false));
        }

        return ResponseEntity.ok(new ApiResponse("Login reușit!", true));
    }


}