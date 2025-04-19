package com.fiiconnect.api.social_secretary;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    // Custom queries (if needed)
    @Query("SELECT c FROM Chat c WHERE c.message is not null")
    List<Chat> findAllChats();
}
