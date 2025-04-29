package com.fiiconnect.api.social_secretary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/announcement")
@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public class AnnouncementController {
    @Autowired
    private  AnnouncementService announcementService;

    @Autowired
    private TagService tagService;

    @Autowired
    private UserService userService;

    @Autowired
    private UserLogatService userLogatService;

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
    public Announcement createAnnouncement(@RequestBody CreateAnnouncementRequest announcementRequest) {
        Set<TagRequest> tagsRequest = announcementRequest.getTags();
        Set<Tag> tags = new HashSet<>();

        // Validarea și procesarea tag-urilor
        for (TagRequest t : tagsRequest) {
            Tag existingTag = tagService.findByNameAndType(t.getName(), t.getType());
            if (existingTag == null) {
                System.out.println("Tag invalid: " + t.getName());
                return null;
            }

            tags.add(existingTag);
        }
        CreateUserRequest user_request = announcementRequest.getProfessor();

        // Validarea utilizatorului care creează anunțul
        CreateUserRequest userRequest = announcementRequest.getProfessor();
        User_Anunturi user = userService.getUserById(userRequest.getId());

        try{
            if(!Objects.equals(userLogatService.getUserLogat().getId(), user.getId())){
                System.out.println("User-ul nu este logat");
                return null;
            }
        }catch(NullPointerException ex){
            System.out.println("Niciun user nu este logat");
            return null;
        }


        if (user == null || (!user.getType().equals("Profesor") && !user.getType().equals("Secretar"))) {
            System.out.println("Autor invalid: utilizatorul nu are permisiunea de a posta anunțuri.");
            return null;
        }

        // Setarea datei publicării
        LocalDate today = LocalDate.now();

        // Crearea și salvarea anunțului
        Announcement announcement = new Announcement(
                announcementRequest.getTitle(),
                announcementRequest.getMessage(),
                user,
                tags,
                today
        );
        return announcementService.saveAnnouncement(announcement);
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

    // updateaza un anunt dupa id
    @PutMapping("/prof-secretar/{id}")
    public Announcement updateAnnouncement(@PathVariable Long id, @RequestBody CreateAnnouncementRequest announcementRequest){
        return announcementService.updateAnnouncement(id,announcementRequest);
    }

    // Șterge un anunț după ID
    @DeleteMapping("/prof-secretar/{id}")
    public void deleteAnnouncement(@PathVariable Long id) {
        announcementService.deleteAnnouncement(id);
    }
}