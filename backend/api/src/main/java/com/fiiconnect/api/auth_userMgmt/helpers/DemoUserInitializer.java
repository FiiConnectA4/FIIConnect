package com.fiiconnect.api.auth_userMgmt.helpers;



import com.fiiconnect.api.auth_userMgmt.models.User;
import com.fiiconnect.api.auth_userMgmt.models.Role;
import com.fiiconnect.api.auth_userMgmt.repositories.UserRepository;
import com.fiiconnect.api.auth_userMgmt.repositories.RoleRepository;
import com.fiiconnect.api.didactic.models.Student;
import com.fiiconnect.api.didactic.models.Professor;
import com.fiiconnect.api.didactic.repositories.StudentRepository;
import com.fiiconnect.api.didactic.repositories.ProfessorRepository;
import com.fiiconnect.api.social_secretary.service.UserTagManagerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * DemoUserInitializer crează următoarele conturi demo la pornirea aplicației:
 *  - ADMIN:
 *      username: admin
 *      email: admin@fiiconnect.com
 *      password: Admin123!
 *
 *  - STUDENT (pentru Student cu id=1):
 *      username: stud1
 *      email: stud1@fiiconnect.com
 *      password: Student123!
 *
 *  - PROFESSOR (pentru Professor cu id=1):
 *      username: prof1
 *      email: prof1@fiiconnect.com
 *      password: Professor123!
*/

@Component
public class DemoUserInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private StudentRepository studentRepository;

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserTagManagerService userTagManagerService;

    @Override
    public void run(String... args) {
        // 1) ADMIN
        createIfNotExists(
                "admin", "admin@fiiconnect.com", "Admin123!",
                "ROLE_ADMIN", null, null
        );

        // 2) STUDENT (pentru Student-ul cu id=1)
        studentRepository.findById(1L).ifPresent(student -> {
            createIfNotExists(
                    "stud1",                           // username ales
                    "stud1@fiiconnect.com",           // email
                    "Student123!",                    // parolă inițială
                    "ROLE_STUDENT",                   // rolul
                    student,                          // link la entitatea Student
                    null                              // fără Professor
            );
        });

        // 3) PROFESSOR (pentru Professor-ul cu id=1)
        professorRepository.findById(1L).ifPresent(professor -> {
            createIfNotExists(
                    "prof1",
                    "prof1@fiiconnect.com",
                    "Professor123!",
                    "ROLE_PROFESOR",
                    null,
                    professor
            );
        });
    }

    /**
     * Creează un utilizator dacă nu există deja pe baza email-ului sau username-ului,
     * îi atribuie rolul (creându-l dacă e nevoie), și (opțional) îl leagă de un Student
     * sau un Professor.
   */
    private void createIfNotExists(
            String username,
            String email,
            String rawPassword,
            String roleName,
            Student student,
            Professor professor
    ) {
        // nu recreăm dacă există deja user cu același username sau email
        if (userRepository.findByUsername(username) != null
                || userRepository.findByEmail(email) != null) {
            return;
        }

        // ROLE
        Role role = roleRepository.findByRoleName(roleName);
        if (role == null) {
            role = new Role();
            role.setRoleName(roleName);
            roleRepository.save(role);
        }

        // USER
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.getRoles().add(role);
        user.setActive(true);
        user.setTwoFactorSecret(null);

        // dacă e cont de student, link la Student
        if (student != null) {
            user.setStudent(student);
        }

        // dacă e cont de profesor, link la Professor
        if (professor != null) {
            user.setProfessor(professor);
        }

        userRepository.save(user);

        if(role.getRoleName().equals("ROLE_ADMIN")){
            userTagManagerService.automaticallyAddTags(user);
        }

        System.out.printf("Contul '%s' (%s) a fost creat cu succes.%n", username, roleName);
    }
}
