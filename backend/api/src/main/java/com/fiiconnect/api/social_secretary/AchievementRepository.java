package com.fiiconnect.api.social_secretary;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AchievementRepository extends JpaRepository<Achievement, Long> {
    // Custom queries (if needed)
}
