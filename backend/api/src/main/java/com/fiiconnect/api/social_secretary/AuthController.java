package com.fiiconnect.api.social_secretary;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired
    private UserLogatService userLogatService;

    @PostMapping("/login")
    public void login(@RequestBody UserLogat userLogat) {
        userLogatService.setUserLogat(userLogat);
    }

    @GetMapping("/current-user")
    public UserLogat getCurrentUser() {
        return userLogatService.getUserLogat();
    }

    @PostMapping("/logout")
    public void logout() {
        userLogatService.logout();
    }
}