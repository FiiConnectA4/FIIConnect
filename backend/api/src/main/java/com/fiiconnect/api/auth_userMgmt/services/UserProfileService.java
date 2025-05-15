package com.fiiconnect.api.auth_userMgmt.services;

import com.fiiconnect.api.auth_userMgmt.models.User;
import com.fiiconnect.api.auth_userMgmt.models.UserProfile;
import com.fiiconnect.api.auth_userMgmt.repositories.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserProfileService {

    @Autowired
    private UserProfileRepository profileRepository;

    public UserProfile getByUser(User user) {
        return profileRepository.findByUser(user);
    }

    public UserProfile updateProfile(UserProfile profile) {
        return profileRepository.save(profile);
    }
}
