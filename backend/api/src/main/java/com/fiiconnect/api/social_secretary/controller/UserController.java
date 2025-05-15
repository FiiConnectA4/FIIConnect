package com.fiiconnect.api.social_secretary.controller;

//imported from auth_userMgmt
import com.fiiconnect.api.auth_userMgmt.repositories.UserRepository;
import com.fiiconnect.api.auth_userMgmt.models.User;

//previous imports
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
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService2 userService2;  // Changed from UserRepository2 to UserService2

    @Autowired
    private TagService tagService;

    @GetMapping("/{id}/tags")
    public Set<Tag> getUserTags(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow(()-> new RuntimeException("User not found"));
        return user.getTags();
    }
}