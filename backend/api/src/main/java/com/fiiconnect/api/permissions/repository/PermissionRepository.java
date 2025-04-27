package com.fiiconnect.api.permissions.repository;

import com.fiiconnect.api.permissions.model.Permission;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermissionRepository extends JpaRepository<Permission, Long> {}
