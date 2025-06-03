package com.fiiconnect.api.auth_userMgmt.controllers;

import com.fiiconnect.api.auth_userMgmt.models.Role;
import com.fiiconnect.api.auth_userMgmt.models.User;
import com.fiiconnect.api.auth_userMgmt.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getStatus() {
        String time = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        return ResponseEntity.ok(Map.of(
                "status", "Online",
                "serverTime", time
        ));
    }

    @GetMapping("/users-count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUsersCount() {
        long count = userRepository.count();
        return ResponseEntity.ok(Map.of("count", count));
    }

    @GetMapping("/user/{username}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUserByUsername(@PathVariable String username) {
        User user = userRepository.findByUsername(username);
        if (user == null) {
            return ResponseEntity.status(404).body(Map.of("error", "Utilizator inexistent"));
        }

        String role = user.getRoles().stream()
                .findFirst()
                .map(Role::getRoleName)
                .orElse("UNKNOWN");

        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "role", role,
                "active", user.isActive()
        ));
    }

    @GetMapping("/recent-users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getRecentUsers() {
        List<User> recent = userRepository.findTop5ByOrderByIdDesc();

        List<Map<String, Object>> result = recent.stream().map(user -> {
            String role = user.getRoles().stream()
                    .findFirst()
                    .map(Role::getRoleName)
                    .orElse("UNKNOWN");

            Map<String, Object> map = new HashMap<>();
            map.put("id", user.getId());
            map.put("username", user.getUsername());
            map.put("email", user.getEmail());
            map.put("role", role);
            map.put("active", user.isActive());
            return map;
        }).toList();

        return ResponseEntity.ok(result);
    }
}
