package com.fiiconnect.api.social_secretary;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/announcement")
//@CrossOrigin(origins = "http://localhost:3000", allowedHeaders = "*")
public class AnnouncementController {
    @Autowired
    private  AnnouncementService announcementService;

    @Autowired
    private TagService tagService;

    @Autowired
    private UserService userService;


   // @CrossOrigin(origins = "http://localhost:3000")
   @GetMapping
    public List<Announcement> getAnnouncements() {
        return announcementService.getAllAnnouncements();
    }
   /* @GetMapping("/{Title}")
    public Announcement getAnnouncementByTitle(@PathVariable String Title){
       return announcementService.getAnnouncement(Title);
    }*/


    @PostMapping
    public Announcement createAnnouncement(@RequestBody CreateAnnouncementRequest announcement_request) {
        System.out.println(announcement_request);
       Set<TagRequest> tags_request = announcement_request.getTags();
       Set<Tag> tags = new HashSet<>();
        for (TagRequest t : tags_request){
            Tag existingTag = tagService.findByNameAndType(t.getName(),t.getType());
            if(existingTag==null)
            {
                System.out.println("nu se poate crea anuntul");
                return null;
            }

            tags.add(existingTag);
        }
        CreateUserRequest user_request = announcement_request.getProfessor();

        User_Anunturi user=userService.getUserByName(user_request.getName());
        if(user==null){
            System.out.println("nu se poate crea anuntul");
            return null;
        }
        else{
            Set<TagRequest> user_tags_request = user_request.getTags();
            Set<Tag> user_tags = new HashSet<>();
            for (TagRequest t : user_tags_request){
                Tag existingTag = tagService.findByNameAndType(t.getName(),t.getType());
                if(existingTag==null)
                {
                    existingTag=new Tag(t.getName(),t.getType());
                    tagService.save(existingTag);
                }

                user_tags.add(existingTag);
            }

            Announcement announcement= new Announcement(announcement_request.getTitle(),announcement_request.getMessage(),user,tags);
            System.out.println(announcement);
            return announcementService.saveAnnouncement(announcement);
        }
    }
}
