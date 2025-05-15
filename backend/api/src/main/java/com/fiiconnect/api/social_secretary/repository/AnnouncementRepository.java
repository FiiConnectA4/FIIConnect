package com.fiiconnect.api.social_secretary.repository;

import com.fiiconnect.api.social_secretary.classes.Announcement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Set;

public interface AnnouncementRepository extends JpaRepository<Announcement, Long> {

    @Query(
            value = "SELECT * FROM ( " +
                    " SELECT at.*, ROWNUM rnum FROM ( " +
                    "   SELECT ANNOUNCEMENT_ID FROM ANNOUNCEMENT_TAGS WHERE TAG_ID = :tagId ORDER BY ANNOUNCEMENT_ID " +
                    " ) at WHERE ROWNUM <= (:#{#pageable.pageNumber + 1} * :#{#pageable.pageSize}) " +
                    ") WHERE rnum > (:#{#pageable.pageNumber} * :#{#pageable.pageSize})",
            countQuery = "SELECT COUNT(*) FROM ANNOUNCEMENT_TAGS WHERE TAG_ID = :tagId",
            nativeQuery = true
    )
            Page<Object[]> getAllAnnouncementsId(@Param("tagId") Long tagId, Pageable pageable);


    @Query(value =
            "SELECT * FROM (" +
                    "  SELECT a.*, ROWNUM rnum FROM (" +
                    "    SELECT * FROM ANNOUNCEMENT WHERE AUTHOR_ID = :id ORDER BY ID" +
                    "  ) a WHERE ROWNUM <= (:#{#pageable.pageNumber + 1} * :#{#pageable.pageSize})" +
                    ") WHERE rnum > (:#{#pageable.pageNumber} * :#{#pageable.pageSize})",
            countQuery = "SELECT COUNT(*) FROM ANNOUNCEMENT WHERE AUTHOR_ID = :id",
            nativeQuery = true)
    Page<Announcement> getAnnouncementsByUserId(@Param("id") Long id, Pageable pageable);


    @Query(
            value = "SELECT * FROM ( " +
                    " SELECT a.*, ROWNUM rnum FROM (SELECT * FROM ANNOUNCEMENT ORDER BY ID DESC) a " +
                    " WHERE ROWNUM <= :#{#pageable.pageNumber + 1} * :#{#pageable.pageSize} " +
                    ") WHERE rnum > :#{#pageable.pageNumber} * :#{#pageable.pageSize}",
            countQuery = "SELECT COUNT(*) FROM ANNOUNCEMENT",
            nativeQuery = true
    )
    Page<Announcement> findAllOrderById(Pageable pageable);

    @Query(value = "SELECT TAG_ID FROM ANNOUNCEMENT_TAGS WHERE ANNOUNCEMENT_ID = :idAnnouncement", nativeQuery = true)
    List<Long> getTagsIdsFromAnnouncementId(@Param("idAnnouncement") Long idAnnouncement);

    @Query(value = "SELECT u.NAME FROM ANNOUNCEMENT a JOIN USER_ANUNTURI u ON a.AUTHOR_ID = u.ID WHERE a.ID = :idAnnouncement", nativeQuery = true)
    String getAuthorUserName(@Param("idAnnouncement") Long idAnnouncement);
}
