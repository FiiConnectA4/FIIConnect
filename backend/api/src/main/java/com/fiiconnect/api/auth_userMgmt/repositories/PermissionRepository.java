package com.fiiconnect.api.auth_userMgmt.repositories;

import com.fiiconnect.api.auth_userMgmt.models.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermissionRepository extends JpaRepository<Permission, Long> {}
