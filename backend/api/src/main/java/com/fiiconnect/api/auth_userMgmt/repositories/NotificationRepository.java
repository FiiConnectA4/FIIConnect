package com.fiiconnect.api.auth_userMgmt.repositories;

import com.fiiconnect.api.auth_userMgmt.models.Notification;
import com.fiiconnect.api.auth_userMgmt.models.User;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipient(User user);
    List<Notification> findByRecipientAndReadFalse(User user);
    List<Notification> findByRecipientAndReadTrue(User user);
    List<Notification> findByRecipient(User user, Pageable pageable);
    List<Notification> findByRecipientAndRead(User user, boolean read, Pageable pageable);

    @Query("""
        SELECT n FROM Notification n
        WHERE n.recipient = :user
        AND (:readStatus IS NULL OR n.read = :readStatus)
        ORDER BY n.timestamp DESC
    """)
    List<Notification> findLimitedByUserAndReadStatus(
            @Param("user") User user,
            @Param("readStatus") Boolean readStatus,
            Pageable pageable
    );
}
