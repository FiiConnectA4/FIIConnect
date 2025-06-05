package com.fiiconnect.api.social_secretary.classes;

import jakarta.persistence.*;
import jdk.jfr.Name;

import java.time.LocalDate;
import java.util.Objects;

@Entity
@Table(name = "ACHIEVEMENT_MANAGER")
public class AchievementManager {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "achievement_man_seq")
    @SequenceGenerator(name = "achievement_man_seq", sequenceName = "achievement_man_seq", allocationSize = 1)
    private Long id;

    @Column(name="USER_ID")
    private Long userId;
    @Column(name="ACHIEVEMENT_ID")
    private Long achievementId;
    @Column(name="RECEIVED_DATE")
    private LocalDate receivedDate;

    public AchievementManager() {}

    public AchievementManager(Long userId, Long achievementId, LocalDate receivedDate) {
        this.userId = userId;
        this.achievementId = achievementId;
        this.receivedDate=receivedDate;
    }


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getAchievementId() {
        return achievementId;
    }

    public void setAchievementId(Long achievementId) {
        this.achievementId = achievementId;
    }

    public LocalDate getReceivedDate() {
        return receivedDate;
    }

    public void setReceivedDate(LocalDate receivedDate) {
        this.receivedDate = receivedDate;
    }


    @Override
    public boolean equals(Object o) {
        if (!(o instanceof AchievementManager that)) return false;
        return Objects.equals(id, that.id)
                && Objects.equals(userId, that.userId)
                && Objects.equals(achievementId, that.achievementId)
                && Objects.equals(receivedDate, that.receivedDate);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, userId, achievementId, receivedDate);
    }

    @Override
    public String toString() {
        return "AchievementManager{" +
                "id=" + id +
                ", userId=" + userId +
                ", achievementId=" + achievementId +
                ", receivedDate=" + receivedDate +
                '}';
    }
}
