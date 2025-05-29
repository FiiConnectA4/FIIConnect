package com.fiiconnect.api.auth_userMgmt.models;

import com.fiiconnect.api.social_secretary.classes.Achievement;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Entity
public class UserProfile {

    @Id
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "user_profile_seq"
    )
    @SequenceGenerator(
            name = "user_profile_seq",
            sequenceName = "user_profile_sequence",
            allocationSize = 1
    )
    private Long id;

    private String firstName; //-
    private String lastName; //- DE MODIFICAT IN USER_CONTROLLER
    private String email;
    private String phone;

    @Column(length = 1000)
    private String about;

    private boolean twoFactorEnabled;

    private String kycStatus;
    private String currentYear; //-
    private double rating;

    @ElementCollection
    private List<String> expertise;

    //ar trebuie sa fie list de achievements
    @ElementCollection
    private List<String> achievements;

    private String profilePictureUrl;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

}
