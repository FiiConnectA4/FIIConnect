package com.fiiconnect.api.auth_userMgmt.controllers;

import com.fiiconnect.api.auth_userMgmt.core.ApiResponse;
import com.fiiconnect.api.auth_userMgmt.core.AuthResponse;
import com.fiiconnect.api.auth_userMgmt.dtos.authDTO.LoginDTO;
import com.fiiconnect.api.auth_userMgmt.dtos.authDTO.RegisterDTO;
import com.fiiconnect.api.auth_userMgmt.exceptions.BadRequestException;
import com.fiiconnect.api.auth_userMgmt.exceptions.TwoFactorException;
import com.fiiconnect.api.auth_userMgmt.exceptions.UserNotFoundException;
import com.fiiconnect.api.auth_userMgmt.models.PasswordResetToken;
import com.fiiconnect.api.auth_userMgmt.models.Role;
import com.fiiconnect.api.auth_userMgmt.models.User;
import com.fiiconnect.api.auth_userMgmt.models.UserProfile;
import com.fiiconnect.api.auth_userMgmt.repositories.PasswordResetTokenRepository;
import com.fiiconnect.api.auth_userMgmt.repositories.RoleRepository;
import com.fiiconnect.api.auth_userMgmt.repositories.UserProfileRepository;
import com.fiiconnect.api.auth_userMgmt.repositories.UserRepository;
import com.fiiconnect.api.auth_userMgmt.services.EmailService;
import com.fiiconnect.api.auth_userMgmt.services.JwtService;
import com.fiiconnect.api.auth_userMgmt.services.TwoFactorAuthenticationService;
import com.fiiconnect.api.auth_userMgmt.validators.EmailValidator;
import com.fiiconnect.api.auth_userMgmt.validators.PasswordValidator;
import com.fiiconnect.api.didactic.models.Professor;
import com.fiiconnect.api.didactic.models.Student;
import com.fiiconnect.api.didactic.repositories.ProfessorRepository;
import com.fiiconnect.api.didactic.repositories.StudentRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final TwoFactorAuthenticationService twoFactorAuthenticationService;
    private final JwtService jwtService;
    private final EmailService emailService;
    private final StudentRepository studentRepository;
    private final ProfessorRepository professorRepository;
    private final UserProfileRepository userProfileRepository;

    @PostConstruct
    public void init() {
        // Simplă verificare că repository‐urile sunt inițializate
        tokenRepository.count();
    }

    /**
     * [POST] /users/2fa/start
     * Începe procesul de activare 2FA pentru utilizatorul curent.
     */
    @PostMapping("/2fa/start")
    public ResponseEntity<ApiResponse> start2FA(@RequestHeader("Authorization") String authHeader) {
        User user = extractUserFromAuthHeader(authHeader);
        if (user.isTwoFactorEnabled()) {
            throw new BadRequestException("2FA este deja activ.");
        }

        String secret = twoFactorAuthenticationService.generateSecretKey();
        user.setPendingTwoFactorSecret(secret);
        userRepository.save(user);

        String qrUrl = twoFactorAuthenticationService.getQRCodeUrl(user.getEmail(), secret);
        Map<String, Object> payload = new HashMap<>();
        payload.put("qrUrl", qrUrl);
        payload.put("secret", secret);
        return ResponseEntity.ok(new ApiResponse("Cheie 2FA generată.", true, payload));
    }

    /**
     * [POST] /users/2fa/confirm
     * Confirmă codul 2FA pentru utilizatorul curent și activează 2FA.
     */
    @PostMapping("/2fa/confirm")
    public ResponseEntity<ApiResponse> confirm2FA(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> body
    ) {
        User user = extractUserFromAuthHeader(authHeader);
        String code = Optional.ofNullable(body.get("code"))
                .orElseThrow(() -> new BadRequestException("Codul 2FA lipsește."));
        String pending = user.getPendingTwoFactorSecret();
        if (pending == null) {
            throw new BadRequestException("Nu a fost inițiată configurarea 2FA.");
        }
        if (!twoFactorAuthenticationService.verifyCode(pending, code)) {
            throw new TwoFactorException("Cod 2FA invalid.");
        }

        user.setTwoFactorSecret(pending);
        user.setPendingTwoFactorSecret(null);
        user.setTwoFactorEnabled(true);
        userRepository.save(user);

        UserProfile profile = user.getProfile();
        if (profile != null) {
            profile.setTwoFactorEnabled(true);
            userProfileRepository.save(profile);
        }

        return ResponseEntity.ok(new ApiResponse("2FA activat cu succes.", true));
    }

    /**
     * [POST] /users/2fa/cancel
     * Anulează procesul de configurare 2FA înainte de confirmare.
     */
    @PostMapping("/2fa/cancel")
    public ResponseEntity<ApiResponse> cancel2FA(@RequestHeader("Authorization") String authHeader) {
        User user = extractUserFromAuthHeader(authHeader);
        user.setPendingTwoFactorSecret(null);
        userRepository.save(user);
        return ResponseEntity.ok(new ApiResponse("Configurare 2FA anulată.", true));
    }

    /**
     * [POST] /users/disable-2fa
     * Dezactivează complet 2FA pentru utilizatorul curent.
     */
    @PostMapping("/disable-2fa")
    public ResponseEntity<ApiResponse> disable2FA(@RequestHeader("Authorization") String authHeader) {
        User user = extractUserFromAuthHeader(authHeader);
        if (!user.isTwoFactorEnabled()) {
            throw new BadRequestException("2FA nu este activat pentru acest cont.");
        }

        user.setTwoFactorSecret(null);
        user.setTwoFactorEnabled(false);

        UserProfile profile = user.getProfile();
        if (profile != null) {
            profile.setTwoFactorEnabled(false);
            userProfileRepository.save(profile);
        }

        userRepository.save(user);
        return ResponseEntity.ok(new ApiResponse("2FA a fost dezactivat cu succes.", true));
    }

    /**
     * [POST] /users/forgot-password
     * Generează și trimite un token de resetare pe email.
     */
    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse> forgotPassword(@RequestParam String email) {
        if (!EmailValidator.isValid(email)) {
            throw new BadRequestException("Email invalid sau lipsă.");
        }

        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UserNotFoundException(email);
        }

        // Șterge token-urile vechi
        tokenRepository.deleteByUser(user);

        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpirationDate(LocalDateTime.now().plusMinutes(30));
        tokenRepository.save(resetToken);

        emailService.sendResetPasswordEmail(email, token);
        return ResponseEntity.ok(new ApiResponse("Link de resetare trimis pe email.", true));
    }

    /**
     * [POST] /users/reset-password
     * Resetează parola pe baza token-ului trimis prin email.
     */
    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse> resetPassword(
            @RequestParam String token,
            @RequestParam String newPassword
    ) {
        if (token == null || newPassword == null) {
            throw new BadRequestException("Token și noua parolă sunt necesare.");
        }
        if (!PasswordValidator.isValid(newPassword)) {
            throw new BadRequestException("Parola nouă nu îndeplinește cerințele de complexitate.");
        }

        PasswordResetToken resetToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new BadRequestException("Token invalid sau expirat."));

        if (resetToken.getExpirationDate().isBefore(LocalDateTime.now())) {
            tokenRepository.delete(resetToken);
            throw new BadRequestException("Token-ul de resetare a expirat.");
        }

        User user = resetToken.getUser();
        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new BadRequestException("Noua parolă nu poate fi aceeași cu cea curentă.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        tokenRepository.delete(resetToken);

        return ResponseEntity.ok(new ApiResponse("Parola a fost resetată cu succes.", true));
    }

    /**
     * [POST] /users/change-password
     * Schimbă parola utilizatorului curent, pe baza parolei vechi.
     */
    @PostMapping("/change-password")
    public ResponseEntity<ApiResponse> changePassword(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> body
    ) {
        User user = extractUserFromAuthHeader(authHeader);

        String oldPassword = Optional.ofNullable(body.get("oldPassword"))
                .orElseThrow(() -> new BadRequestException("Parola veche lipsește."));
        String newPassword = Optional.ofNullable(body.get("newPassword"))
                .orElseThrow(() -> new BadRequestException("Parola nouă lipsește."));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new BadRequestException("Parola veche este incorectă.");
        }
        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new BadRequestException("Noua parolă nu poate fi aceeași cu cea veche.");
        }
        if (!PasswordValidator.isValid(newPassword)) {
            throw new BadRequestException("Parola nouă nu îndeplinește cerințele de complexitate.");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        return ResponseEntity.ok(new ApiResponse("Parola a fost schimbată cu succes.", true));
    }

    /**
     * [POST] /users/register
     * Înregistrează un nou utilizator (STUDENT sau PROFESSOR).
     * NU RETURNEAZĂ ÎN NICIUN RĂSPUNS PAROLA ÎN CLEARTEXT!
     */
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> registerUser(@RequestBody RegisterDTO registerRequest) {
        // 1) Verificări de bază
        if (registerRequest == null
                || registerRequest.getUsername() == null
                || registerRequest.getPassword() == null
                || registerRequest.getEmail() == null
                || registerRequest.getRole() == null) {
            throw new BadRequestException("Toate câmpurile (username, email, parola, rol) sunt necesare.");
        }

        String username = registerRequest.getUsername().trim();
        String password = registerRequest.getPassword();
        String email = registerRequest.getEmail().trim();
        String roleName = registerRequest.getRole().trim().toUpperCase();

        if (username.isEmpty()) {
            throw new BadRequestException("Username-ul nu poate fi gol.");
        }
        if (!PasswordValidator.isValid(password)) {
            throw new BadRequestException(
                    "Parola trebuie să conțină minim 8 caractere, o literă mare, una mică, o cifră și un simbol."
            );
        }
        if (!EmailValidator.isValid(email)) {
            throw new BadRequestException("Email invalid.");
        }
        if (userRepository.findByEmail(email) != null) {
            throw new BadRequestException("Email deja folosit.");
        }
        if (userRepository.findByUsername(username).isPresent()) {
            throw new BadRequestException("Username deja folosit.");
        }

        // 2) Validare rol
        Role role = roleRepository.findByRoleName("ROLE_" + roleName);
        if (role == null) {
            throw new BadRequestException("Rol invalid. Roluri posibile: STUDENT sau PROFESSOR.");
        }

        // 3) Asignare rol și date specifice STUDENT / PROFESSOR
        User user = new User();
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setActive(true);
        user.getRoles().add(role);
        user.setTwoFactorSecret(null);

        if ("ROLE_STUDENT".equals(role.getRoleName())) {
            Long studentId = registerRequest.getStudentId();
            if (studentId == null) {
                throw new BadRequestException("Pentru STUDENT trebuie furnizat studentId.");
            }
            Student student = studentRepository.findById(studentId)
                    .orElseThrow(() -> new BadRequestException("Student inexistent cu ID-ul: " + studentId));
            user.setStudent(student);

        } else if ("ROLE_PROFESSOR".equals(role.getRoleName())) {
            Long profId = registerRequest.getProfessorId();
            if (profId == null) {
                throw new BadRequestException("Pentru PROFESSOR trebuie furnizat professorId.");
            }
            Professor prof = professorRepository.findById(profId)
                    .orElseThrow(() -> new BadRequestException("Profesor inexistent cu ID-ul: " + profId));
            user.setProfessor(prof);
        }

        // 4) Salvăm user și creăm profil gol (opțional)
        userRepository.save(user);

//        // Cream un profil gol, doar cu referință la user (opțional)
//        UserProfile profile = new UserProfile();
//        profile.setUser(user);
//        profile.setKycStatus("Unverified");
//        profileService.updateProfile(profile); // presupunem că ai metoda updateProfile
        // dacă nu vrei profil gol, comentează liniile de mai sus

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ApiResponse("Înregistrare realizată cu succes. Username: " + username, true));
    }

    /**
     * [POST] /users/register-multiple
     * Înregistrează mai mulți utilizatori într‐o singură tranzacție.
     */
    @PostMapping("/register-multiple")
    @Transactional
    public ResponseEntity<ApiResponse> registerMultipleUsers(
            @RequestBody List<RegisterDTO> registerRequests
    ) {
        if (registerRequests == null || registerRequests.isEmpty()) {
            throw new BadRequestException("Lista de înregistrări este goală.");
        }

        List<String> createdUsers = new ArrayList<>();
        for (RegisterDTO req : registerRequests) {
            // Realizăm aceleași validări ca la registerUser(…)
            String username = Optional.ofNullable(req.getUsername()).orElse("").trim();
            String password = Optional.ofNullable(req.getPassword()).orElse("");
            String email = Optional.ofNullable(req.getEmail()).orElse("").trim();
            String roleName = Optional.ofNullable(req.getRole()).orElse("").trim().toUpperCase();

            if (username.isEmpty() || password.isEmpty() || email.isEmpty() || roleName.isEmpty()) {
                throw new BadRequestException("Fiecare utilizator necesită username, email, parola și rol.");
            }
            if (!PasswordValidator.isValid(password)) {
                throw new BadRequestException(
                        "Parola pentru '" + username + "' nu îndeplinește cerințele de complexitate."
                );
            }
            if (!EmailValidator.isValid(email)) {
                throw new BadRequestException("Email invalid pentru '" + username + "'.");
            }
            if (userRepository.findByEmail(email) != null) {
                throw new BadRequestException("Email deja folosit: " + email);
            }
            if (userRepository.findByUsername(username).isPresent()) {
                throw new BadRequestException("Username deja folosit: " + username);
            }

            Role role = roleRepository.findByRoleName("ROLE_" + roleName);
            if (role == null) {
                throw new BadRequestException("Rol invalid pentru '" + username + "'.");
            }

            // Creăm user
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setActive(true);
            user.getRoles().add(role);
            user.setTwoFactorSecret(null);

            if ("ROLE_STUDENT".equals(role.getRoleName())) {
                Long studentId = req.getStudentId();
                if (studentId == null) {
                    throw new BadRequestException("Pentru STUDENT '" + username + "' nu s-a furnizat studentId.");
                }
                Student student = studentRepository.findById(studentId)
                        .orElseThrow(() -> new BadRequestException("Student inexistent cu ID-ul: " + studentId));
                user.setStudent(student);

            } else if ("ROLE_PROFESOR".equals(role.getRoleName())) {
                Long profId = req.getProfessorId();
                if (profId == null) {
                    throw new BadRequestException("Pentru PROFESOR '" + username + "' nu s-a furnizat professorId.");
                }
                Professor prof = professorRepository.findById(profId)
                        .orElseThrow(() -> new BadRequestException("Profesor inexistent cu ID-ul: " + profId));
                user.setProfessor(prof);
            }

            userRepository.save(user);
            createdUsers.add(username);
        }

        return ResponseEntity.ok(
                new ApiResponse("Conturi create: " + String.join(", ", createdUsers), true)
        );
    }

    /**
     * [POST] /users/login
     * Autentificare simplă fără 2FA (dacă 2FA nu e activat).
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginRequest) {
        if (loginRequest == null
                || loginRequest.getUsername() == null
                || loginRequest.getPassword() == null) {
            throw new BadRequestException("Username și parola sunt necesare.");
        }

        String username = loginRequest.getUsername().trim();
        String password = loginRequest.getPassword();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new BadRequestException("Username sau parolă incorecte.");
        }

        if (user.isTwoFactorEnabled()) {
            // Trimitem răspuns special că e nevoie de 2FA
            Map<String, Object> payload = Map.of("2faRequired", true);
            return ResponseEntity.ok(new ApiResponse("2FA_REQUIRED", true, payload));
        }

        user.setActive(true);
        userRepository.save(user);

        List<GrantedAuthority> authorities = user.getRoles().stream()
                .map(r -> new SimpleGrantedAuthority(r.getRoleName()))
                .collect(Collectors.toList());

        String jwtToken = jwtService.generateToken(user.getUsername(), authorities);

        Map<String, Object> resp = new HashMap<>();
        resp.put("token", jwtToken);
        resp.put("user", Map.of("username", user.getUsername()));

        return ResponseEntity.ok(resp);
    }

    /**
     * [POST] /users/login/verify
     * Verifică codul 2FA și returnează JWT dacă e corect.
     */
    @PostMapping("/login/verify")
    public ResponseEntity<?> verifyTwoFactor(@RequestBody LoginDTO loginRequest) {
        if (loginRequest == null
                || loginRequest.getUsername() == null
                || loginRequest.getTwoFactorCode() == null) {
            throw new BadRequestException("Username și cod 2FA sunt necesare.");
        }

        User user = userRepository.findByUsername(loginRequest.getUsername())
                .orElseThrow(() -> new UserNotFoundException(loginRequest.getUsername()));

        if (!user.isTwoFactorEnabled() || user.getTwoFactorSecret() == null) {
            throw new BadRequestException("2FA nu este activat pentru acest cont.");
        }

        boolean codeOk = twoFactorAuthenticationService.verifyCode(
                user.getTwoFactorSecret(),
                loginRequest.getTwoFactorCode()
        );
        if (!codeOk) {
            throw new TwoFactorException("Cod 2FA invalid.");
        }

        user.setActive(true);
        userRepository.save(user);

        List<GrantedAuthority> authorities = user.getRoles().stream()
                .map(r -> new SimpleGrantedAuthority(r.getRoleName()))
                .collect(Collectors.toList());

        String jwtToken = jwtService.generateToken(user.getUsername(), authorities);
        return ResponseEntity.ok(new AuthResponse(jwtToken));
    }

    /**
     * [POST] /users/logout
     * Deloghează utilizatorul curent (dezactivează flag-ul isActive).
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse> logout(@RequestHeader("Authorization") String authHeader) {
        User user = extractUserFromAuthHeader(authHeader);

        user.setActive(false);
        userRepository.save(user);
        return ResponseEntity.ok(new ApiResponse("Delogare realizată cu succes.", true));
    }

    //============================================================
    // Metodă internă centralizată care extrage User-ul din header-ul "Authorization"
    //============================================================
    private User extractUserFromAuthHeader(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new BadRequestException("Token lipsă sau format incorect.");
        }
        String token = authHeader.substring(7);
        String username;
        try {
            username = jwtService.extractUsername(token);
        } catch (Exception ex) {
            throw new BadRequestException("Token invalid.");
        }
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new UserNotFoundException(username));
    }
}
