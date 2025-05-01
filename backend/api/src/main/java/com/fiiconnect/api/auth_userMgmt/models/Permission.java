<<<<<<<< HEAD:backend/api/src/main/java/com/fiiconnect/api/auth_userMgmt/permissions/model/Permission.java
package com.fiiconnect.api.auth_userMgmt.permissions.model;
========
package com.fiiconnect.api.auth_userMgmt.models;
>>>>>>>> module/auth_dashboard:backend/api/src/main/java/com/fiiconnect/api/auth_userMgmt/models/Permission.java


import jakarta.persistence.*;
import java.util.HashSet;
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
