package com.fiiconnect.api.auth_userMgmt.repositories;

import com.fiiconnect.api.auth_userMgmt.models.Role;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RoleRepository extends JpaRepository<Role, Long> {}

