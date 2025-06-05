package com.fiiconnect.api.social_secretary.repository;

import com.fiiconnect.api.social_secretary.classes.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Set;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    @Query(value = "SELECT ANNOUNCEMENT_ID FROM ANNOUNCEMENT_TAGS WHERE TAG_ID = :tagId ORDER BY ANNOUNCEMENT_ID", nativeQuery = true)
    List<Long> getAllAnnouncementsId(@Param("tagId") Long tagId);

    @Query(value = "SELECT * FROM ANNOUNCEMENT WHERE AUTHOR_ID = :id ORDER BY ID", nativeQuery = true)
    Set<Announcement> getAnnouncementsByUserId(@Param("id") Long id);

    // Add this method to get all announcements ordered by ID
    @Query(value = "SELECT * FROM ANNOUNCEMENT ORDER BY ID DESC", nativeQuery = true)
    List<Announcement> findAllOrderById();

    @Query(value = "SELECT TAG_ID FROM ANNOUNCEMENT_TAGS WHERE ANNOUNCEMENT_ID = :idAnnouncement" , nativeQuery = true)
    List<Long> getTagsIdsFromAnnouncementId(@Param("idAnnouncement") Long idAnnouncement);

    @Query(value = "SELECT u.NAME from ANNOUNCEMENT a JOIN USER_ANUNTURI u ON " +
            "a.AUTHOR_ID = u.ID WHERE a.ID = :idAnnouncement" , nativeQuery = true)
    String getAuthorUserName(@Param("idAnnouncement") Long idAnnouncement);

    @Query(value="select count(id) from ANNOUNCEMENT where AUTHOR= :userId",nativeQuery = true)
    Integer countUserAnnouncements(@Param("userId") Long userId);
}