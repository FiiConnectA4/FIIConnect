package com.fiiconnect.api.social_secretary.service;

import com.fiiconnect.api.social_secretary.classes.Achievement;
import com.fiiconnect.api.social_secretary.repository.AchievementRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class AchievementService {

    @Autowired
    private AchievementRepository achievementRepository;


    public List<Achievement> getAllAchievements() {
        return achievementRepository.findAll();
    }

    public Achievement saveAchievement(Achievement achievement) {
        return achievementRepository.save(achievement);
    }

    public Achievement updateAchievement(Long id, Achievement updatedAchievement) {
        Achievement currentAchievement = achievementRepository.findById(id).orElse(null);
        if(currentAchievement == null){
            System.out.println("id-ul nu exista");
            return null;
        }
        currentAchievement.setName(updatedAchievement.getName());
        currentAchievement.setDateAchieved(updatedAchievement.getDateAchieved());
        currentAchievement.setDescription(updatedAchievement.getDescription());
        currentAchievement.setUser(updatedAchievement.getUser());
        return achievementRepository.save(currentAchievement);
    }

    public void deleteAchievement(Long id) {
        achievementRepository.deleteById(id);
    }
}
