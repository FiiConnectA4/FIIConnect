package com.fiiconnect.api.social_secretary;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;  // Changed from UserRepository to UserService

    @PostMapping
    public User_Anunturi createUser(@RequestBody User_Anunturi user) {
        return userService.createUser(user);
    }

    @GetMapping
    public List<User_Anunturi> getAllUsers() {
        return userService.getAllUsers();
    }

    // You can add more endpoints as needed
    @GetMapping("/{id}")
    public User_Anunturi getUserById(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}