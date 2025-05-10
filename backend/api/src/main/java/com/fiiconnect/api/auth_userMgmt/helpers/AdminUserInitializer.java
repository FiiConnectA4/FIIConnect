package com.fiiconnect.api.auth_userMgmt.helpers;

import com.fiiconnect.api.auth_userMgmt.models.User;
import com.fiiconnect.api.auth_userMgmt.repositories.UserRepository;
import com.fiiconnect.api.auth_userMgmt.models.Role;
import com.fiiconnect.api.auth_userMgmt.repositories.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminUserInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        String adminEmail = "admin@fiiconnect.com";
        String adminUsername = "admin";

        if (userRepository.findByEmail(adminEmail) == null && userRepository.findByUsername(adminUsername) == null) {
            Role adminRole = roleRepository.findByRoleName("ROLE_ADMIN");

            if (adminRole == null) {
                adminRole = new Role();
                adminRole.setRoleName("ROLE_ADMIN");
                roleRepository.save(adminRole);
            }

            User admin = new User();
            admin.setUsername(adminUsername);
            admin.setEmail(adminEmail);
            admin.setPassword(passwordEncoder.encode("Admin123!"));
            admin.getRoles().add(adminRole);
            admin.setActive(true);
            admin.setTwoFactorSecret(null);

            userRepository.save(admin);
            System.out.println("Contul admin a fost creat cu succes.");
        }
    }
}
