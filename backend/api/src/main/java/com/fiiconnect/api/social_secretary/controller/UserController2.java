package com.fiiconnect.api.social_secretary.controller;

import com.fiiconnect.api.social_secretary.DTO.UserDTO;
import com.fiiconnect.api.social_secretary.DTO.TagDTO;
import com.fiiconnect.api.social_secretary.service.TagService;
import com.fiiconnect.api.social_secretary.service.UserService2;
import com.fiiconnect.api.social_secretary.classes.Tag;
import com.fiiconnect.api.social_secretary.classes.User_Anunturi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/users")
public class UserController2 {

    @Autowired
    private UserService2 userService2;  // Changed from UserRepository2 to UserService2
    @Autowired
    private TagService tagService;
    @PostMapping
    public User_Anunturi createUser(@RequestBody UserDTO user_request) {
        Set<TagDTO> tags_request = user_request.getTags();
        Set<Tag> tags = new HashSet<>();

        for (TagDTO t : tags_request){
            Tag existingTag = tagService.findByNameAndType(t.getName(),t.getType());
            if(existingTag==null)
            {
                System.out.println("Tag invalid: " + t.getName());
                return null;
            }

            tags.add(existingTag);
        }
        System.out.println(tags);
        User_Anunturi user = new User_Anunturi(user_request.getName(),user_request.getType(),tags);
        System.out.println(user);
        return userService2.createUser(user);
    }

    @GetMapping
    public List<User_Anunturi> getAllUsers() {
        return userService2.getAllUsers();
    }

    // You can add more endpoints as needed
    @GetMapping("/{id}")
    public User_Anunturi getUserById(@PathVariable Long id) {
        return userService2.getUserById(id);
    }

    @GetMapping("/{id}/tags")
    public Set<Tag> getUserTags(@PathVariable Long id) {
        User_Anunturi user = userService2.getUserById(id);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        return user.getTags();
    }

    @PutMapping("/{id}")
    public User_Anunturi updateUser(@PathVariable Long id, @RequestBody UserDTO updatedUser){
        return userService2.updateUser(id,updatedUser);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService2.deleteUser(id);
    }
}