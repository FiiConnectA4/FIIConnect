<<<<<<<< HEAD:backend/api/src/main/java/com/fiiconnect/api/auth_userMgmt/permissions/model/Role.java
package com.fiiconnect.api.auth_userMgmt.permissions.model;

import com.fiiconnect.api.auth_userMgmt.models.User;
========
package com.fiiconnect.api.auth_userMgmt.models;

import com.fiiconnect.api.auth_userMgmt.models.Permission;
>>>>>>>> module/auth_dashboard:backend/api/src/main/java/com/fiiconnect/api/auth_userMgmt/models/Role.java
import jakarta.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "roles")
public class Role {
    @Id
    @GeneratedValue
    private Long id;

    @Column(nullable = false, unique = true)
    private String roleName;

    @ManyToMany(mappedBy = "roles")
    private Set<User> users = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "role_permissions",
            joinColumns = @JoinColumn(name = "role_id"),
            inverseJoinColumns = @JoinColumn(name = "permission_id")
    )
    private Set<Permission> permissions = new HashSet<>();

    // Constructori, getteri, setteri, etc.
<<<<<<<< HEAD:backend/api/src/main/java/com/fiiconnect/api/auth_userMgmt/permissions/model/Role.java
========

    public String getRoleName() {
        return roleName;
    }
    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
>>>>>>>> module/auth_dashboard:backend/api/src/main/java/com/fiiconnect/api/auth_userMgmt/models/Role.java
}

