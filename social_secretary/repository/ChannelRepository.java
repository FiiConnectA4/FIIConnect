package com.fiiconnect.api.social_secretary.repository;

import com.fiiconnect.api.social_secretary.classes.Channel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface  ChannelRepository extends JpaRepository<Channel, Long> {

    @Query(value = "SELECT c.ID, c.NAME from CHANNEL c JOIN CHANNEL_TAGS t ON c.ID = t.CHANNEL_ID where t.TAG_ID = :tagId" , nativeQuery = true)
    List<Channel> findAllChannelsWithTag(@Param("tagId")Long id);
}
