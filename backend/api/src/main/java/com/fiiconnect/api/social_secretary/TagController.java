package com.fiiconnect.api.social_secretary;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tags")
public class TagController {

    @Autowired
    private TagService tagService;

    @PostMapping
    public Tag createTag(@RequestBody Tag tag) {
        return tagService.save(tag);
    }

    @GetMapping
    public List<Tag> getAllTags() {
        return tagService.findAll();
    }

    @GetMapping("/byType")
    public List<Tag> getTagsByType(@RequestParam TagType type) {
        return tagService.findByType(type);
    }

    @DeleteMapping("/{id}")
    public void deleteTag(@PathVariable Long id) {
        tagService.deleteTag(id);
    }
}