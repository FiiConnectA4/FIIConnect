package com.fiiconnect.api.modulexemplu;


import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "permissions")
public class Permission {
    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false, unique = true)
    private String permissionName;

    @ManyToMany(mappedBy = "permissions")
    private Set<Role> roles = new HashSet<>();

    // Constructori, getteri, setteri, etc.
}
