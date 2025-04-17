package com.fiiconnect.api.social_secretary;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;  // Changed from UserRepository to UserService
    @Autowired
    private TagService tagService;
    @PostMapping
    public User_Anunturi createUser(@RequestBody CreateUserRequest user_request) {
        Set<TagRequest> tags_request = user_request.getTags();
        Set<Tag> tags = new HashSet<>();

        for (TagRequest t : tags_request){
            Tag existingTag = tagService.findByNameAndType(t.getName(),t.getType());
            if(existingTag==null)
            {
                existingTag=new Tag(t.getName(),t.getType());
                tagService.save(existingTag);
            }

            tags.add(existingTag);
        }
        System.out.println(tags);
        User_Anunturi user = new User_Anunturi(user_request.getName(),tags);
        System.out.println(user);
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