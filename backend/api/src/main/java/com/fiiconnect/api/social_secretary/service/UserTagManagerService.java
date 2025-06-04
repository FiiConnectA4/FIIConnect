package com.fiiconnect.api.social_secretary.service;

import com.fiiconnect.api.auth_userMgmt.dtos.PersonInfoDTO;
import com.fiiconnect.api.auth_userMgmt.models.User;
import com.fiiconnect.api.auth_userMgmt.repositories.UserRepository;
import com.fiiconnect.api.social_secretary.DTO.TagDTO;
import com.fiiconnect.api.social_secretary.repository.TagRepository;
import com.fiiconnect.api.social_secretary.repository.UserTagManagerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

import static org.springframework.web.servlet.function.ServerResponse.status;

@Service
public class UserTagManagerService {

    @Autowired
    UserTagManagerRepository userTagManagerRepository;

    @Autowired
    TagRepository tagRepository;

    @Autowired
    UserRepository userRepository;

    public ResponseEntity<?> addTagToUser(Long whoIsLoggedId, Long userId, Long tagId) {
        User user = userRepository.findById(whoIsLoggedId).orElse(null);
        if(user.getRoles().stream().findFirst().get().getRoleName().equals("ROLE_ADMIN")||
           user.getRoles().stream().findFirst().get().getRoleName().equals("ROLE_SECRETARY")){
            userTagManagerRepository.addTagToUser(userId, tagId);
            return ResponseEntity.status(200).body("tag atribuit cu succes");
        }
        else {
            return ResponseEntity.status(401).body(
                    "acest user nu are privilegii de adaugare de taguri"
            );
        }
    }

    public ResponseEntity<List<TagDTO>> getAllUserTags(Long userId) {
        List<Long>tagIds = userTagManagerRepository.getAllUserTags(userId);
        return  ResponseEntity.status(200).body(
                tagIds.stream().
                map(tagId -> tagRepository.findById(tagId).orElse(null)).
                map(tag-> new TagDTO(tag.getId(),tag.getName(),tag.getType())).
                collect(Collectors.toList()));
    }

    public ResponseEntity<String> removeTagFromUser(Long whoIsLoggedId, Long userId, Long tagId) {
        User user = userRepository.findById(whoIsLoggedId).orElse(null);
        if(user.getRoles().stream().findFirst().get().getRoleName().equals("ROLE_ADMIN")||
                user.getRoles().stream().findFirst().get().getRoleName().equals("ROLE_SECRETARY")){
            userTagManagerRepository.deleteByUserIdAndTagId(userId, tagId);
            return ResponseEntity.status(200).body("tag atribuit cu succes");
        }
        else {
            return ResponseEntity.status(401).body(
                    "acest user nu are privilegii de adaugare de taguri"
            );
        }
    }
}
/*
Set<TagDTO> tagDTOs = user.getTags().stream()
                .map(tag -> new TagDTO(tag.getName(), tag.getType()))
                .collect(Collectors.toSet());
 */