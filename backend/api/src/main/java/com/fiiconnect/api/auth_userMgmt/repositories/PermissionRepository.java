<<<<<<<< HEAD:backend/api/src/main/java/com/fiiconnect/api/auth_userMgmt/permissions/repository/PermissionRepository.java
package com.fiiconnect.api.auth_userMgmt.permissions.repository;

import com.fiiconnect.api.auth_userMgmt.permissions.model.Permission;
========
package com.fiiconnect.api.auth_userMgmt.repositories;

import com.fiiconnect.api.auth_userMgmt.models.Permission;
>>>>>>>> module/auth_dashboard:backend/api/src/main/java/com/fiiconnect/api/auth_userMgmt/repositories/PermissionRepository.java
import org.springframework.data.jpa.repository.JpaRepository;

public interface PermissionRepository extends JpaRepository<Permission, Long> {}
