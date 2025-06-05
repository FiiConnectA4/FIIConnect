package com.fiiconnect.api.social_secretary.service;

import com.fiiconnect.api.social_secretary.DTO.AchievementDTO;
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

    public Achievement getAchievementByName(String name){ return achievementRepository.findByName(name);}

    public Achievement saveAchievement(AchievementDTO achievementDTO) {

        return achievementRepository.save(
                new Achievement(
                        achievementDTO.getName(),
                        achievementDTO.getDescription()
                ));
    }

    public Achievement updateAchievement(Long id, AchievementDTO updatedAchievement) {
        Achievement currentAchievement = achievementRepository.findById(id).orElse(null);
        if(currentAchievement == null){
            System.out.println("id-ul nu exista");
            return null;
        }
        currentAchievement.setName(updatedAchievement.getName());
        currentAchievement.setDescription(updatedAchievement.getDescription());
        return achievementRepository.save(currentAchievement);
    }

    public void deleteAchievement(Long id) {
        achievementRepository.deleteById(id);
    }
}
