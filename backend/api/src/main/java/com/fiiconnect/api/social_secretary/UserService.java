package com.fiiconnect.api.social_secretary;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

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

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}