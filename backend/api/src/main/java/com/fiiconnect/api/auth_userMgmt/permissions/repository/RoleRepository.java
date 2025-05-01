package com.fiiconnect.api.auth_userMgmt.permissions.repository;

import com.fiiconnect.api.auth_userMgmt.permissions.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByRoleName(String roleName);
}
