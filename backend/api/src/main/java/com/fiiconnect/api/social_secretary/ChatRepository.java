package com.fiiconnect.api.social_secretary;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    // Custom queries (if needed)
}
