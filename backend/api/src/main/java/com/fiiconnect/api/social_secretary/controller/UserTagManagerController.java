package com.fiiconnect.api.social_secretary.controller;

import com.fiiconnect.api.auth_userMgmt.dtos.PersonInfoDTO;
import com.fiiconnect.api.auth_userMgmt.models.User;
import com.fiiconnect.api.auth_userMgmt.repositories.UserRepository;
import com.fiiconnect.api.social_secretary.DTO.TagDTO;
import com.fiiconnect.api.social_secretary.classes.Tag;
import com.fiiconnect.api.social_secretary.repository.TagRepository;
import com.fiiconnect.api.social_secretary.service.TagService;
import com.fiiconnect.api.social_secretary.service.UserTagManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/manage_tags")
public class UserTagManagerController {
    @Autowired
    UserTagManagerService userTagManagerService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<TagDTO>> getAllUserTags(@PathVariable Long userId) {
        return userTagManagerService.getAllUserTags(userId);
    }


    @PostMapping("/{whoIsLoggedId}/{userId}/{tagId}")
    public ResponseEntity<?> addTagToUser(@PathVariable Long whoIsLoggedId,
                                       @PathVariable Long userId,
                                       @PathVariable Long tagId){
        return userTagManagerService.addTagToUser(whoIsLoggedId,userId,tagId);
    }

    /*@PostMapping("/{userId}/{tagId}")
    public void addTagToUser(@RequestBody PersonInfoDTO whoIsLogged, @PathVariable Long userId, @PathVariable Long tagId) {
        if (whoIsLogged.role().equals("ADMIN") || whoIsLogged.role().equals("SECRETARY")) {
            Tag tag = tagRepository.findById(tagId).orElse(null);
            User user = userRepository.findById(userId).orElse(null);
            PersonInfoDTO personInfoDTO = new PersonInfoDTO(
                    user.getId(),
                    user.getUsername(),
                    user.getEmail(),
                    user.getRoles().stream().findFirst().toString(),
                    null,
                    null,
                    user.getTags().stream().
                            map(t -> new TagDTO(t.getName(), t.getType())).
                            collect(Collectors.toSet())
            );
            userTagManagerService.addTagToUser(personInfoDTO, new TagDTO(tag.getId(), tag.getName(), tag.getType()));
        } else {
            System.out.println("acest user nu are privilegii de atribuire a tagurilor");
        }
    }*/

    @DeleteMapping("/{whoIsLoggedId}/{userId}/{tagId}")
    public void removeTagFromUser(@PathVariable Long whoIsLoggedId,@PathVariable Long userId, @PathVariable Long tagId) {
        userTagManagerService.removeTagFromUser(whoIsLoggedId,userId, tagId);
    }
}
