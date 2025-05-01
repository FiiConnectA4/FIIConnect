package com.fiiconnect.api.auth_userMgmt.repositories;

import com.fiiconnect.api.auth_userMgmt.models.Role;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {
    @Query("SELECT r FROM Role r WHERE r.roleName = :roleName")
    Role findByRoleName(@Param("roleName") String roleName);
}

