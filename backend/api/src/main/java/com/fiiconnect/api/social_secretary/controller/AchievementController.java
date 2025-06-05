package com.fiiconnect.api.social_secretary.controller;

import com.fiiconnect.api.social_secretary.DTO.AchievementDTO;
import com.fiiconnect.api.social_secretary.service.AchievementManagerService;
import com.fiiconnect.api.social_secretary.service.AchievementService;
import com.fiiconnect.api.social_secretary.classes.Achievement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/achievements")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public class AchievementController {

    @Autowired
    private AchievementService achievementService;

    @Autowired
    private AchievementManagerService achievementManagerService;

    @GetMapping
    public List<Achievement> getAllAchievements() {
        return achievementService.getAllAchievements();
    }


    //returneaza lista cu toate achievementurile unui utilizator
    @GetMapping("/userAchievements/{userId}")
    public List<Achievement> getAllUserAchievements(@PathVariable Long userId){
        System.out.println("hello from achievements");
        return achievementManagerService.getAllUserAchievements(userId);
    }

    //returneaza data primirii achievementului
    @GetMapping("/userAchievementsDate/{userId}/{achievementId}")
    public String getReceivedDate(@PathVariable Long userId, @PathVariable Long achievementId){
        return achievementManagerService.getReceivedDate(userId,achievementId);
    }

    @PostMapping
    public Achievement createAchievement(@RequestBody AchievementDTO achievementDTO) {
        return achievementService.saveAchievement(achievementDTO);
    }

    @PutMapping("/{id}")
    public Achievement updateAchievement(@PathVariable Long id, @RequestBody AchievementDTO updatedAchievement){
        return achievementService.updateAchievement(id,updatedAchievement);
    }

    @DeleteMapping("/{id}")
    public void deleteAchievement(@PathVariable Long id){
        achievementService.deleteAchievement(id);
    }
}
