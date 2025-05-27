package com.fiiconnect.api.auth_userMgmt.models;

import com.fiiconnect.api.didactic.models.Professor;
import com.fiiconnect.api.didactic.models.Student;
import com.fiiconnect.api.social_secretary.classes.Tag;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Getter
@Setter
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_seq_gen")
    @SequenceGenerator(name = "user_seq_gen", sequenceName = "users_seq", allocationSize = 1)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(unique = true)
    private String email;

    @Column(name = "two_factor_secret")
    private String twoFactorSecret;

    private boolean isActive = false;
    private String pendingTwoFactorSecret;
    private boolean twoFactorEnabled = false;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "users_roles",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private UserProfile profile;

    @OneToOne
    @JoinTable(name = "users_students",
            joinColumns        = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id"))
    private Student student;

    @OneToOne
    @JoinTable(name = "users_professors",
            joinColumns        = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "professor_id"))
    private Professor professor;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_tags",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();

}
