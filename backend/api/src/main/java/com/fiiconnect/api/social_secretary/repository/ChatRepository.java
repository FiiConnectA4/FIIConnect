package com.fiiconnect.api.social_secretary.repository;

import com.fiiconnect.api.social_secretary.classes.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    // Custom queries (if needed)
    @Query("SELECT c FROM Chat c WHERE c.message is not null order by timestamp ")
    List<Chat> findAllChats();

    @Query("SELECT c FROM Chat c WHERE c.channelId = :channelId ORDER BY c.timestamp ASC")
    List<Chat> findByChannelIdOrderByTimestampAsc(@Param("channelId") Long channelId);
}
