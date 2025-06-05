package com.fiiconnect.api.social_secretary.repository;

import com.fiiconnect.api.social_secretary.classes.Achievement;
import com.fiiconnect.api.social_secretary.classes.AchievementManager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface AchievementManagerRepository extends JpaRepository<AchievementManager,Long> {

    @Query(value="SELECT ACHIEVEMENT_ID FROM  ACHIEVEMENT_MANAGER where USER_ID= :userId", nativeQuery = true)
    List<Long> getAllUserAchievements(@Param("userId") Long userId);

    @Query(value="SELECT RECEIVED_DATE FROM ACHIEVEMENT_MANAGER where USER_ID= :userId AND ACHIEVEMENT_ID= :achievementId" ,nativeQuery = true)
    String findReceivedDateByUserIdAndAchievementId(@Param("userId") Long userId,@Param("achievementId") Long achievementId);
}
