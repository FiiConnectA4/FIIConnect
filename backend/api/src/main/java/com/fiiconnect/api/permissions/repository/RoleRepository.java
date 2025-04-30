package com.fiiconnect.api.permissions.repository;

import com.fiiconnect.api.permissions.model.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Role findByRoleName(String roleName);
}
