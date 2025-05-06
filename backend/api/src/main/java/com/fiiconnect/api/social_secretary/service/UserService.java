package com.fiiconnect.api.social_secretary.service;

import com.fiiconnect.api.social_secretary.DTO.UserDTO;
import com.fiiconnect.api.social_secretary.DTO.TagDTO;
import com.fiiconnect.api.social_secretary.classes.Tag;
import com.fiiconnect.api.social_secretary.classes.User_Anunturi;
import com.fiiconnect.api.social_secretary.repository.TagRepository;
import com.fiiconnect.api.social_secretary.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TagRepository tagRepository;

    public List<User_Anunturi> getAllUsers() {
        return userRepository.findAll();
    }

    public User_Anunturi createUser(User_Anunturi user) {
        return userRepository.save(user);
    }

    // You can add more methods as needed, for example:
    public User_Anunturi getUserById(Long id) {
        return userRepository.findById(id).orElse(null);
    }
    public User_Anunturi getUserByName(String name) {
        return userRepository.findByName(name);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public User_Anunturi updateUser(Long id, UserDTO updatedUser) {
        User_Anunturi currentUser = userRepository.findById(id).orElse(null);

        Set<TagDTO> tagRequest=updatedUser.getTags();

        try {
            currentUser.setName(updatedUser.getName());
            currentUser.setType(updatedUser.getType());

            Set<Tag> managedTags=new HashSet<>();
            for(TagDTO tag : tagRequest){
                Tag managed = tagRepository.findByNameAndType(tag.getName(),tag.getType());
                if(managed!=null){
                    managedTags.add(managed);
                }
            }
            currentUser.getTags().clear();
            currentUser.getTags().addAll(managedTags);
            return userRepository.save(currentUser);
        }catch(NullPointerException ex){
            System.out.println("acest id este invalid");
            return null;
        }
    }
}