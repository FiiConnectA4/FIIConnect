package com.fiiconnect.api.auth_userMgmt.repositories;

import com.fiiconnect.api.auth_userMgmt.models.Notification;
import com.fiiconnect.api.auth_userMgmt.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByRecipientAndReadFalse(User user);
    List<Notification> findByRecipient(User user);
}
