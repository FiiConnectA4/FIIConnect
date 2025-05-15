package com.fiiconnect.api.auth_userMgmt.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import net.minidev.json.annotate.JsonIgnore;

import java.time.LocalDateTime;

@Setter
@Getter
@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "notification_seq_gen")
    @SequenceGenerator(name = "notification_seq_gen", sequenceName = "notifications_seq", allocationSize = 1)
    private Long id;


    private String title;
    private String content;
    private String type;

    private boolean read = false;
    private LocalDateTime timestamp = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User recipient;

}
