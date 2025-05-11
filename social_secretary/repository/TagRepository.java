package com.fiiconnect.api.social_secretary.repository;
import com.fiiconnect.api.social_secretary.enums.TagType;
import com.fiiconnect.api.social_secretary.classes.Tag;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TagRepository extends JpaRepository<Tag, Long> {
    List<Tag> findByType(TagType type);
    Tag findByNameAndType(String name,TagType type);
}
