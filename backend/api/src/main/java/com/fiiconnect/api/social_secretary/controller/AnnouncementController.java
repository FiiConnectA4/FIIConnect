package com.fiiconnect.api.social_secretary.controller;
import com.fiiconnect.api.auth_userMgmt.dtos.PersonInfoDTO;
import com.fiiconnect.api.auth_userMgmt.dtos.ProfessorDTO;
import com.fiiconnect.api.auth_userMgmt.models.User;
import com.fiiconnect.api.auth_userMgmt.repositories.UserRepository;
import com.fiiconnect.api.social_secretary.DTO.AnnouncementDTO;
import com.fiiconnect.api.social_secretary.DTO.TagDTO;
import com.fiiconnect.api.social_secretary.classes.Announcement;
import com.fiiconnect.api.social_secretary.classes.Tag;
import com.fiiconnect.api.social_secretary.service.AnnouncementService;
import com.fiiconnect.api.social_secretary.service.TagService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/announcement")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public class AnnouncementController {
    @Autowired
    private AnnouncementService announcementService;

    @Autowired
    private TagService tagService;

    //@Autowired
    //private UserService2 userService2;

   // @Autowired
   // private UserLogatService userLogatService;

    @Autowired
    private UserRepository userRepository;

    // Obține toate anunțurile
    @GetMapping
    public List<Announcement> getAllAnnouncements() {
        return announcementService.getAllAnnouncements();
    }
   /* @GetMapping("/{Title}")
    public Announcement getAnnouncementByTitle(@PathVariable String Title){
       return announcementService.getAnnouncement(Title);
    }*/

    // Obtine toate anunturile existente pt profi si secretari
    @GetMapping("/prof-secretar")
    public List<Announcement> getAllAnnouncementsForProfAndSecretary() {
        return announcementService.getAllAnnouncements();
    }

    // Creează un nou anunț (doar pt profi si secretari)
    @PostMapping("/prof-secretar")
    public Announcement createAnnouncement(@RequestBody AnnouncementDTO announcementRequest) {
            return announcementService.saveAnnouncement(announcementRequest);
        }


    // Obține un anunț specific după ID
    @GetMapping("/{id}")
    public Announcement getAnnouncementById(@PathVariable Long id) {
        return announcementService.getAnnouncementById(id);
    }

    // Obtine un anunt specific dupa ID pt profi si secretari
    @GetMapping("/prof-secretar/{id}")
    public Announcement getAnnouncementByIdForProfAndSecretary(@PathVariable Long id) {
        return announcementService.getAnnouncementById(id);
    }


    private List<Announcement> getAllAnnouncementsWithTagId(Long tagId){
            List<Long> announcementsId = announcementService.getAllAnnouncementsId(tagId);
            List<Announcement> allAnnouncements = new ArrayList<>();
            for(Long id : announcementsId){
                allAnnouncements.add(announcementService.getAnnouncementById(id));
            }
            return allAnnouncements;
    }

    //obtine anunturile dupa un set de id-uri de tag-uri specificate pt profi si secretari
    @GetMapping("/prof-secretar/with-tag")
    public List<Announcement> getAnnouncementsWithTagsForProfAndSecretary(@RequestParam List<Long> tagIds){
        List<Announcement> allAnnouncements = new ArrayList<>();
        for (Long id : tagIds){
            allAnnouncements.addAll(getAllAnnouncementsWithTagId(id));
        }
        return allAnnouncements;
    }

    //obtine anunturile dupa un set de id-uri de tag-uri specificate
    @GetMapping("/with-tag")
    public Set<Announcement> getAnnouncementsWithTags(@RequestParam List<Long> tagIds){
        Set<Announcement> allAnnouncements = new HashSet<>();
        for (Long id : tagIds){
            allAnnouncements.addAll(getAllAnnouncementsWithTagId(id));
        }
        return allAnnouncements;
    }

    //obtine toate anunturile unui user specificat dupa id
    @GetMapping("/with-user-id/{id}")
    public Set<Announcement> getAnnouncementsWithUserId(@PathVariable Long id){
        return announcementService.getAnnouncementsByUserId(id);
    }

    //obtine toate anunturile unui user specificat dupa id pt profi si secretari
    @GetMapping("/prof-secretar/with-user-id/{id}")
    public Set<Announcement> getAnnouncementsWithUserIdForProfAndSecretary(@PathVariable Long id){
        return announcementService.getAnnouncementsByUserId(id);
    }

    //obtine id-urile tag-urilor in functie de id-ul unui anunt
    @GetMapping("/{idAnnouncement}/tags")
    public List<Long> getTagsIdsFromAnnouncementId (@PathVariable Long idAnnouncement){
        return announcementService.getTagsIdsFromAnnouncementId(idAnnouncement);
    }

    //obtine user-name-ul celui care a postat anuntul
    @GetMapping("/{idAnnouncement}/userName")
    public String getAuthorUserName(@PathVariable Long idAnnouncement){
        return announcementService.getAuthorUserName(idAnnouncement);
    }

    // updateaza un anunt dupa id
    /*@PutMapping("/prof-secretar/{id}")
    public Announcement updateAnnouncement(@PathVariable Long id, @RequestBody AnnouncementDTO announcementRequest){
        return announcementService.updateAnnouncement(id,announcementRequest);
    }*/

    @PutMapping("/prof-secretar/{id}")
    public Announcement updateAnnouncement(@PathVariable Long id, @RequestBody AnnouncementDTO announcementRequest) {
        return announcementService.updateAnnouncement(id, announcementRequest);
    }

    // Șterge un anunț după ID
    @DeleteMapping("/prof-secretar/{id}")
    public void deleteAnnouncement(@PathVariable Long id, @RequestParam Long userId) {
        announcementService.deleteAnnouncement(id, userId);
        System.out.println("Delete called with id=" + id + " userId=" + userId);
        System.out.println("Anunțul a fost șters cu succes.");
    }


}