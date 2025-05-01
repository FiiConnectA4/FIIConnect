package com.fiiconnect.api.auth_userMgmt.permissions.repository;

import com.fiiconnect.api.auth_userMgmt.permissions.model.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermissionRepository extends JpaRepository<Permission, Long> {}
