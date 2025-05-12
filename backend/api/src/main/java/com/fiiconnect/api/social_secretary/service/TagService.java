package com.fiiconnect.api.social_secretary.service;
import com.fiiconnect.api.social_secretary.enums.TagType;
import com.fiiconnect.api.social_secretary.classes.Tag;
import com.fiiconnect.api.social_secretary.repository.TagRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class TagService {
    @Autowired
    private TagRepository tagRepository;

    public List<Tag> getTagsByType(TagType type) {
        return tagRepository.findByType(type);
    }
    public void deleteTag(Long id) {
        tagRepository.deleteById(id);
}

    public List<Tag> findByType(TagType type) {
        return tagRepository.findByType(type);
    }

    public Tag findByNameAndType(String name,TagType type) {
        return tagRepository.findByNameAndType(name,type);
    }

    public Tag save(Tag tag) {
        return tagRepository.save(tag);
    }

    public List<Tag> findAll() {
        return tagRepository.findAll();
    }

    public Tag updateTag(Long id, Tag updatedTag) {
        Tag currentTag = tagRepository.findById(id).orElse(null);
        if(currentTag==null){
            System.out.println("nu exista acest id");
            return null;
        }
        currentTag.setName(updatedTag.getName());
        currentTag.setType(currentTag.getType());
        return tagRepository.save(currentTag);
    }
}