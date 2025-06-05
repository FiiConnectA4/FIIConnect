package com.fiiconnect.api.auth_userMgmt.controllers;

import com.fiiconnect.api.auth_userMgmt.dtos.UpdateUserProfileRequest;
import com.fiiconnect.api.auth_userMgmt.dtos.UserProfileRequest; // Asigură-te că acest DTO este folosit corect.
import com.fiiconnect.api.auth_userMgmt.models.User;
import com.fiiconnect.api.auth_userMgmt.models.UserProfile;
import com.fiiconnect.api.auth_userMgmt.repositories.UserRepository;
import com.fiiconnect.api.auth_userMgmt.services.UserProfileService;
import com.fiiconnect.api.didactic.services.SftpService; // Presupunând că acest serviciu este corect configurat.
import org.slf4j.Logger; // Adăugat pentru logging
import org.slf4j.LoggerFactory; // Adăugat pentru logging
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
// import org.springframework.security.access.AccessDeniedException; // Nu mai prindem specific
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * Controller pentru gestionarea profilurilor utilizatorilor și a pozelor de profil.
 * Toate endpoint-urile de aici necesită ca utilizatorul să fie autentificat (via JWT).
 */
@RestController
@RequestMapping("/profile")
public class UserProfileController {

    private static final Logger logger = LoggerFactory.getLogger(UserProfileController.class); // Adăugat logger

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileService profileService;

    @Autowired
    private SftpService sftpService; // Serviciu pentru interacțiunea cu SFTP.

    // Folderul de pe serverul SFTP unde sunt stocate pozele de profil.
    private final String PROFILE_FOLDER = "faculty_files/profile_pictures/";

    /**
     * GET /profile
     * Preia profilul utilizatorului autentificat curent.
     * Necesită un token JWT valid în header-ul Authorization.
     * @param userDetails Detaliile utilizatorului autentificat, injectate de Spring Security.
     * @return ResponseEntity conținând UserProfileRequest sau un mesaj de eroare.
     */
    @GetMapping
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        logger.info("GET /profile apelat de utilizatorul: {}", userDetails.getUsername());
        try {
            User user = userRepository.findByUsername(userDetails.getUsername());
            if (user == null) {
                logger.warn("Utilizatorul {} nu a fost găsit în baza de date.", userDetails.getUsername());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilizator negăsit în sistem.");
            }
            UserProfile profile = profileService.getByUser(user);

            if (profile == null) {
                logger.info("Profilul pentru utilizatorul {} nu a fost încă creat (status 404).", user.getUsername());
                // Frontend-ul ar trebui să gestioneze acest 404 și să trimită la /profile/setup.
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profilul nu a fost găsit. Completați-vă profilul.");
            }

            logger.debug("Profil găsit pentru utilizatorul {}: {}", user.getUsername(), profile);
            // Folosește UserProfileRequest pentru a construi răspunsul.
            return ResponseEntity.ok(new UserProfileRequest(user, profile));
        } catch (Exception e) {
            logger.error("Eroare la preluarea profilului pentru {}: ", userDetails.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Eroare server la preluarea profilului.");
        }
    }

    /**
     * PUT /profile
     * Actualizează profilul utilizatorului autentificat curent.
     * Necesită un token JWT valid.
     * @param userDetails Detaliile utilizatorului autentificat.
     * @param dto Obiectul UpdateUserProfileRequest conținând datele de actualizat.
     * @return ResponseEntity cu DTO-ul actualizat sau un mesaj de eroare.
     */
    @PutMapping
    public ResponseEntity<?> updateProfile(@AuthenticationPrincipal UserDetails userDetails,
                                           @RequestBody UpdateUserProfileRequest dto) {
        logger.info("PUT /profile apelat de utilizatorul: {} cu date: {}", userDetails.getUsername(), dto);
        try {
            User user = userRepository.findByUsername(userDetails.getUsername());
            if (user == null) {
                logger.warn("Utilizatorul {} nu a fost găsit în baza de date pentru actualizare profil.", userDetails.getUsername());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilizator negăsit.");
            }
            UserProfile profile = profileService.getByUser(user);
            if (profile == null) {
                logger.warn("Profilul pentru utilizatorul {} nu a fost găsit pentru actualizare.", user.getUsername());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profil inexistent pentru actualizare.");
            }

            // Aplică actualizările din DTO pe obiectul UserProfile.
            profile.setPhone(dto.getPhone());
            profile.setAbout(dto.getAbout());
            // Asigură-te că firstName și lastName sunt non-null în DTO dacă sunt obligatorii.
            if (dto.getFirstName() != null) profile.setFirstName(dto.getFirstName());
            if (dto.getLastName() != null) profile.setLastName(dto.getLastName());
            // TODO: Adaugă aici și alte câmpuri din UserProfileRequest/UpdateUserProfileRequest care pot fi modificate.

            UserProfile updatedProfile = profileService.updateProfile(profile); // Salvează și returnează profilul actualizat.
            logger.info("Profilul pentru utilizatorul {} a fost actualizat cu succes.", user.getUsername());

            // Returnează întregul profil actualizat (sau doar un mesaj de succes dacă preferi).
            // Recomandabil să returnezi entitatea actualizată.
            return ResponseEntity.ok(new UserProfileRequest(user, updatedProfile));
        } catch (Exception e) {
            logger.error("Eroare la actualizarea profilului pentru {}: ", userDetails.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Eroare server la actualizarea profilului.");
        }
    }

    /**
     * POST /profile/setup
     * Creează un profil pentru utilizatorul autentificat curent, dacă nu există deja.
     * Necesită un token JWT valid.
     * @param userDetails Detaliile utilizatorului autentificat.
     * @param dto Obiectul UpdateUserProfileRequest conținând datele inițiale ale profilului.
     * @return ResponseEntity cu un mesaj de succes sau eroare.
     */
    @PostMapping("/setup")
    public ResponseEntity<?> createProfile(@AuthenticationPrincipal UserDetails userDetails,
                                           @RequestBody UpdateUserProfileRequest dto) {
        logger.info("POST /profile/setup apelat de utilizatorul: {} cu date: {}", userDetails.getUsername(), dto);
        try {
            User user = userRepository.findByUsername(userDetails.getUsername());
            if (user == null) {
                logger.warn("Utilizatorul {} nu a fost găsit în baza de date pentru crearea profilului.", userDetails.getUsername());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilizator negăsit.");
            }

            if (profileService.getByUser(user) != null) {
                logger.warn("Tentativă de a crea un profil existent pentru utilizatorul: {}", user.getUsername());
                return ResponseEntity.badRequest().body("Profilul pentru acest utilizator există deja.");
            }

            UserProfile profile = new UserProfile();
            profile.setUser(user);
            // Setează câmpurile obligatorii și valorile default.
            profile.setFirstName(dto.getFirstName()); // Presupunând că sunt trimise din frontend la setup.
            profile.setLastName(dto.getLastName());
            profile.setPhone(dto.getPhone());
            profile.setAbout(dto.getAbout());
            profile.setKycStatus("Unverified"); // Default
            profile.setTwoFactorEnabled(user.isTwoFactorEnabled()); // Sincronizează cu starea 2FA a utilizatorului.
            profile.setCurrentYear("Not set"); // Valori default sau preluate din DTO dacă sunt disponibile.
            profile.setRating(0);
            // TODO: Setează și alte câmpuri default dacă este necesar.

            UserProfile createdProfile = profileService.updateProfile(profile); // Metoda 'update' poate funcționa și ca 'saveOrUpdate'.
            logger.info("Profil creat cu succes pentru utilizatorul {}.", user.getUsername());
            return ResponseEntity.status(HttpStatus.CREATED).body(new UserProfileRequest(user, createdProfile));
        } catch (Exception e) {
            logger.error("Eroare la crearea profilului pentru {}: ", userDetails.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Eroare server la crearea profilului.");
        }
    }

    /**
     * POST /profile/photo
     * Încarcă sau actualizează poza de profil pentru utilizatorul autentificat.
     * Necesită un token JWT valid și un fișier trimis ca multipart/form-data.
     * @param userDetails Detaliile utilizatorului autentificat.
     * @param file Fișierul imagine încărcat.
     * @return ResponseEntity cu un mesaj de succes sau eroare.
     */
    @PostMapping("/photo")
    public ResponseEntity<?> uploadProfilePhoto(@AuthenticationPrincipal UserDetails userDetails,
                                                @RequestParam("file") MultipartFile file) {
        logger.info("POST /profile/photo apelat de utilizatorul: {} pentru fișierul: {}", userDetails.getUsername(), file.getOriginalFilename());
        try {
            User user = userRepository.findByUsername(userDetails.getUsername());
            if (user == null) {
                logger.warn("Utilizatorul {} nu a fost găsit în baza de date pentru upload poză.", userDetails.getUsername());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilizator negăsit.");
            }
            UserProfile profile = profileService.getByUser(user);

            if (profile == null) {
                logger.warn("Profilul pentru utilizatorul {} nu a fost găsit pentru upload poză.", user.getUsername());
                // Poate ar trebui creat un profil minim aici sau returnat un mesaj mai specific
                // pentru frontend să redirecționeze la /profile/setup.
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Profilul utilizatorului nu există. Completează mai întâi profilul.");
            }

            // Validare tip fișier și dimensiune (recomandat și pe server)
            if (file.isEmpty() || file.getOriginalFilename() == null) {
                return ResponseEntity.badRequest().body("Fișierul trimis este gol sau invalid.");
            }
            // TODO: Adaugă validare pentru tipul de conținut (ex. doar image/jpeg, image/png) și dimensiune.

            // Construiește un nume unic pentru fișier pe serverul SFTP.
            String extension = getExtension(Objects.requireNonNull(file.getOriginalFilename()));
            String filename = "profile-" + user.getId() + extension; // Nume fișier bazat pe ID-ul utilizatorului.
            logger.debug("Nume fișier generat pentru poză profil: {}", filename);

            // Încarcă fișierul prin SFTP.
            sftpService.uploadFile(file, PROFILE_FOLDER, filename);
            logger.info("Poză de profil încărcată cu succes prin SFTP pentru utilizatorul {}: {}", user.getUsername(), filename);

            // Actualizează calea pozei de profil în entitatea UserProfile.
            profile.setProfilePicture(filename); // Stochează doar numele fișierului, nu calea completă.
            profileService.updateProfile(profile);
            logger.info("Calea pozei de profil a fost actualizată în BD pentru utilizatorul {}.", user.getUsername());

            // Returnează un răspuns de succes, poate incluzând noua cale a pozei.
            Map<String, String> responseBody = new HashMap<>();
            responseBody.put("message", "Poza de profil a fost încărcată cu succes.");
            responseBody.put("filePath", PROFILE_FOLDER + filename); // Calea relativă pe serverul SFTP.
            return ResponseEntity.ok(responseBody);

        } catch (IOException e) {
            logger.error("Eroare I/O la încărcarea pozei de profil pentru {}: ", userDetails.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Eroare I/O la încărcarea pozei.");
        } catch (Exception e) {
            logger.error("Eroare neașteptată la încărcarea pozei de profil pentru {}: ", userDetails.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Eroare server la încărcarea pozei: " + e.getMessage());
        }
    }

    /**
     * GET /profile/photo
     * Preia și servește poza de profil a utilizatorului autentificat.
     * Necesită un token JWT valid.
     * @param userDetails Detaliile utilizatorului autentificat.
     * @return ResponseEntity conținând resursa imagine sau un mesaj de eroare.
     */
    @GetMapping("/photo")
    public ResponseEntity<?> getProfilePhoto(@AuthenticationPrincipal UserDetails userDetails) {
        logger.info("GET /profile/photo apelat de utilizatorul: {}", userDetails.getUsername());
        try {
            User user = userRepository.findByUsername(userDetails.getUsername());
            if (user == null) {
                logger.warn("GET /profile/photo: Utilizatorul {} nu a fost găsit.", userDetails.getUsername());
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilizator negăsit.");
            }
            UserProfile profile = profileService.getByUser(user);

            if (profile == null) {
                logger.warn("GET /profile/photo: Profilul pentru {} nu a fost găsit.", user.getUsername());
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Profilul nu a fost găsit pentru utilizatorul: " + user.getUsername());
            }
            if (profile.getProfilePicture() == null || profile.getProfilePicture().trim().isEmpty()) {
                logger.info("GET /profile/photo: Utilizatorul {} nu are setată o poză de profil.", user.getUsername());
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Nicio poză de profil setată pentru utilizatorul: " + user.getUsername());
            }

            String fullPathOnSftp = PROFILE_FOLDER + profile.getProfilePicture();
            logger.debug("Se încearcă descărcarea fișierului de pe SFTP: {}", fullPathOnSftp);

            File downloadedFile = sftpService.downloadFile(fullPathOnSftp, profile.getProfilePicture());

            if (downloadedFile == null || !downloadedFile.exists()) {
                logger.error("Fișierul descărcat de pe SFTP nu a fost găsit pe disc sau descărcarea a eșuat: {}", profile.getProfilePicture());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Fișierul imagine nu a putut fi recuperat de pe server.");
            }
            logger.info("Fișierul {} a fost descărcat cu succes de pe SFTP, locație temporară: {}", profile.getProfilePicture(), downloadedFile.getAbsolutePath());


            Path path = downloadedFile.toPath();
            Resource resource = new UrlResource(path.toUri()); // Creează o resursă din fișierul local.

            if (!resource.exists() || !resource.isReadable()) {
                logger.error("Resursa pentru fișierul {} nu există sau nu poate fi citită.", path.toString());
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Resursa imagine nu este accesibilă.");
            }

            String contentType = Files.probeContentType(path); // Încearcă să detecteze tipul de conținut.
            if (contentType == null) {
                contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE; // Fallback la tip binar generic.
                logger.warn("Nu s-a putut detecta Content-Type pentru {}. Se folosește {}.", path.toString(), contentType);
            }
            logger.debug("Content-Type detectat pentru {}: {}", path.toString(), contentType);

            // Returnează resursa imagine.
            // Header-ul Content-Disposition "inline" sugerează browser-ului să afișeze imaginea, nu să o descarce.
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);

        } catch (MalformedURLException e) { // Specific pentru UrlResource
            logger.error("URL malformat pentru resursa imagine pentru utilizatorul {}: ", userDetails.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Eroare la localizarea resursei imagine.");
        } catch (IOException e) { // Poate fi aruncat de Files.probeContentType, sftpService.downloadFile, sau UrlResource
            logger.error("Eroare I/O în getProfilePhoto pentru utilizatorul {}: ", userDetails.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Eroare I/O la procesarea imaginii.");
        } catch (Exception e) { // Prinde orice altă excepție neașteptată.
            logger.error("Eroare neașteptată în getProfilePhoto pentru utilizatorul {}: ", userDetails.getUsername(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Eroare server neașteptată: " + e.getMessage());
        }
        // TODO: Adaugă un bloc `finally` pentru a șterge `downloadedFile` de pe disc după ce a fost servit,
        //       deoarece este doar o copie temporară.
    }

    /**
     * Extrage extensia dintr-un nume de fișier.
     * @param filename Numele fișierului.
     * @return Extensia fișierului, incluzând punctul (ex: ".jpg").
     */
    private String getExtension(String filename) {
        if (filename == null || filename.lastIndexOf(".") == -1) {
            return ""; // Fără extensie sau nume de fișier invalid
        }
        return filename.substring(filename.lastIndexOf("."));
    }
}