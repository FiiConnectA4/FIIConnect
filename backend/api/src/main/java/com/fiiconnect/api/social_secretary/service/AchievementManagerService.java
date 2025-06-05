package com.fiiconnect.api.social_secretary.service;

import com.fiiconnect.api.auth_userMgmt.repositories.UserRepository;
import com.fiiconnect.api.auth_userMgmt.services.UserProfileService;
import com.fiiconnect.api.social_secretary.classes.Achievement;
import com.fiiconnect.api.social_secretary.classes.AchievementManager;
import com.fiiconnect.api.social_secretary.repository.AchievementManagerRepository;
import com.fiiconnect.api.social_secretary.repository.AchievementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AchievementManagerService {

    @Autowired
    AchievementManagerRepository achievementManagerRepository;

    @Autowired
    AchievementRepository achievementRepository;

    public ResponseEntity<?> addAchievementToUser(Long userId, Long achievementId){
        return ResponseEntity.
                status(200).
                body(achievementManagerRepository.save(new AchievementManager(
                         userId,
                         achievementId,
                        LocalDate.now())));
    }

    public List<Achievement> getAllUserAchievements(Long userId) {
        System.out.println("hi from managerservice");
        List<Long>achievementIds= achievementManagerRepository.getAllUserAchievements(userId);
        return achievementRepository.findAllById(achievementIds).stream().toList();
    }

    public String getReceivedDate(Long userId, Long achievementId) {
        return achievementManagerRepository.findReceivedDateByUserIdAndAchievementId(userId,achievementId);
    }
}
