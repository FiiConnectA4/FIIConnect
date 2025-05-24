package com.fiiconnect.api;

import com.fiiconnect.api.social_secretary.classes.Tag;
import com.fiiconnect.api.social_secretary.enums.TagType;
import com.fiiconnect.api.social_secretary.repository.TagRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import com.fiiconnect.api.social_secretary.service.TagService;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TagServiceTest {

    private TagRepository tagRepository;
    private TagService tagService;

    @BeforeEach
    void setUp() {
        tagRepository = mock(TagRepository.class);
        tagService = new TagService();
        // inject manually since you're using @Autowired in original code
        var field = Arrays.stream(TagService.class.getDeclaredFields())
                .filter(f -> f.getType().equals(TagRepository.class)).findFirst().orElseThrow();
        field.setAccessible(true);
        try {
            field.set(tagService, tagRepository);
        } catch (IllegalAccessException e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void testFindAll() {
        Tag tag1 = new Tag("test1", TagType.GENERAL);
        Tag tag2 = new Tag("test2", TagType.AN);
        when(tagRepository.findAll()).thenReturn(List.of(tag1, tag2));

        List<Tag> tags = tagService.findAll();
        assertEquals(2, tags.size());
        verify(tagRepository, times(1)).findAll();
    }

    @Test
    void testFindByType() {
        Tag tag = new Tag("materie1", TagType.MATERIE);
        when(tagRepository.findByType(TagType.MATERIE)).thenReturn(List.of(tag));

        List<Tag> tags = tagService.findByType(TagType.MATERIE);
        assertEquals(1, tags.size());
        assertEquals(TagType.MATERIE, tags.get(0).getType());
    }

    @Test
    void testFindByNameAndType() {
        Tag tag = new Tag("grupaA", TagType.GRUPA);
        when(tagRepository.findByNameAndType("grupaA", TagType.GRUPA)).thenReturn(tag);

        Tag found = tagService.findByNameAndType("grupaA", TagType.GRUPA);
        assertNotNull(found);
        assertEquals("grupaA", found.getName());
        assertEquals(TagType.GRUPA, found.getType());
    }

    @Test
    void testSave() {
        Tag tag = new Tag("seminarX", TagType.SEMINAR);
        when(tagRepository.save(tag)).thenReturn(tag);

        Tag saved = tagService.save(tag);
        assertEquals("seminarX", saved.getName());
        assertEquals(TagType.SEMINAR, saved.getType());
    }

    @Test
    void testDelete() {
        Long id = 1L;
        tagService.deleteTag(id);
        verify(tagRepository, times(1)).deleteById(id);
    }

    @Test
    void testUpdateTag() {
        Long id = 1L;
        Tag existing = new Tag("OldName", TagType.AN);
        Tag updated = new Tag("NewName", TagType.GENERAL);  // will ignore new type per your logic

        when(tagRepository.findById(id)).thenReturn(Optional.of(existing));
        when(tagRepository.save(any(Tag.class))).thenAnswer(i -> i.getArguments()[0]);

        Tag result = tagService.updateTag(id, updated);
        assertEquals("NewName", result.getName());
        assertEquals(TagType.AN, result.getType()); // keeps old type
    }

    @Test
    void testUpdateTagNotFound() {
        Long id = 99L;
        when(tagRepository.findById(id)).thenReturn(Optional.empty());

        Tag updated = new Tag("Doesn'tMatter", TagType.GENERAL);
        Tag result = tagService.updateTag(id, updated);
        assertNull(result);
    }
}
