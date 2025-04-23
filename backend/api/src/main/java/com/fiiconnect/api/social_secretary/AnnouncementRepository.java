package com.fiiconnect.api.social_secretary;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    @Query(value = "SELECT ANNOUNCEMENT_ID FROM ANNOUNCEMENT_TAGS WHERE TAG_ID = :tagId", nativeQuery = true)
    List<Long> getAllAnnouncementsId(@Param("tagId") Long tagId);

    @Query(value = "SELECT * FROM ANNOUNCEMENT WHERE AUTHOR_ID = :id", nativeQuery = true)
    Set<Announcement> getAnnouncementsByUserId(@Param("id") Long id);
}