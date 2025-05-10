package com.fiiconnect.api.auth_userMgmt.helpers;


import com.fiiconnect.api.auth_userMgmt.models.Role;
import com.fiiconnect.api.auth_userMgmt.repositories.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class RoleInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) {
        List<String> defaultRoles = List.of("ROLE_ADMIN", "ROLE_PROFESOR", "ROLE_STUDENT");

        for (String roleName : defaultRoles) {
            if (roleRepository.findByRoleName(roleName) == null) {
                Role role = new Role();
                role.setRoleName(roleName);
                roleRepository.save(role);
            }
        }
    }
}