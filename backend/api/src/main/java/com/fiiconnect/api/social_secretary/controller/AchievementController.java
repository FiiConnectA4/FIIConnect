package com.fiiconnect.api.social_secretary.controller;

import com.fiiconnect.api.social_secretary.DTO.AchievementDTO;
import com.fiiconnect.api.social_secretary.service.AchievementService;
import com.fiiconnect.api.social_secretary.classes.Achievement;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/achievements")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public class AchievementController {

    @Autowired
    private AchievementService achievementService;

    @GetMapping
    public List<Achievement> getAllAchievements() {
        return achievementService.getAllAchievements();
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
