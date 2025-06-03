package com.fiiconnect.api.social_secretary.service;

import com.fiiconnect.api.auth_userMgmt.repositories.UserRepository;
import com.fiiconnect.api.auth_userMgmt.services.UserProfileService;
import com.fiiconnect.api.social_secretary.classes.AchievementManager;
import com.fiiconnect.api.social_secretary.repository.AchievementManagerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class AchievementManagerService {

    @Autowired
    AchievementManagerRepository achievementManagerRepository;


    public ResponseEntity<?> addAchievementToUser(Long userId, Long achievementId){
        return ResponseEntity.
                status(200).
                body(achievementManagerRepository.save(new AchievementManager(
                         userId,
                         achievementId,
                        LocalDate.now())));
    }

}
