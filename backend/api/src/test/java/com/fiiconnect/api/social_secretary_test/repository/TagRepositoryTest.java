package com.fiiconnect.api.social_secretary_test.repository;

import com.fiiconnect.api.social_secretary.classes.Tag;
import com.fiiconnect.api.social_secretary.enums.TagType;
import com.fiiconnect.api.social_secretary.repository.TagRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.autoconfigure.orm.jpa.TestEntityManager;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
@Transactional
public class TagRepositoryTest {

    @Autowired
    private TestEntityManager entityManager;

    @Autowired
    private TagRepository tagRepository;

    @BeforeEach
    void setUp() {
        // Clear the persistence context
        entityManager.clear();
    }

    @Test
    void save_ShouldPersistTag() {
        // Arrange
        Tag tag = new Tag("Important", TagType.GENERAL);

        // Act
        Tag saved = tagRepository.save(tag);
        entityManager.flush();

        // Assert
        assertThat(saved).isNotNull();
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getName()).isEqualTo("Important");
        assertThat(saved.getType()).isEqualTo(TagType.GENERAL);
    }

    @Test
    void save_ShouldPersistTagUsingConstructor() {
        // Arrange
        Tag tag = new Tag("Algoritmica", TagType.MATERIE);

        // Act
        Tag saved = tagRepository.save(tag);
        entityManager.flush();

        // Assert
        assertThat(saved).isNotNull();
        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getName()).isEqualTo("Algoritmica");
        assertThat(saved.getType()).isEqualTo(TagType.MATERIE);
    }

    @Test
    void findById_ShouldReturnTag() {
        // Arrange
        Tag tag = new Tag("Programare Orientata Obiect", TagType.MATERIE);
        Tag persisted = tagRepository.save(tag);
        entityManager.flush();
        entityManager.clear();

        // Act
        Optional<Tag> found = tagRepository.findById(persisted.getId());

        // Assert
        assertThat(found).isPresent();
        assertThat(found.get().getName()).isEqualTo("Programare Orientata Obiect");
        assertThat(found.get().getType()).isEqualTo(TagType.MATERIE);
    }

    @Test
    void findById_WithNonExistentId_ShouldReturnEmpty() {
        // Act
        Optional<Tag> found = tagRepository.findById(999L);

        // Assert
        assertThat(found).isEmpty();
    }

    @Test
    void findByType_WithGeneralType_ShouldReturnGeneralTags() {
        // Arrange
        tagRepository.save(new Tag("Important", TagType.GENERAL));
        tagRepository.save(new Tag("Urgent", TagType.GENERAL));
        tagRepository.save(new Tag("POO", TagType.MATERIE));
        tagRepository.save(new Tag("Anul 2", TagType.AN));
        entityManager.flush();

        // Act
        List<Tag> generalTags = tagRepository.findByType(TagType.GENERAL);

        // Assert
        assertThat(generalTags).hasSize(2);
        assertThat(generalTags).allMatch(tag -> tag.getType() == TagType.GENERAL);
        assertThat(generalTags).extracting(Tag::getName)
                .containsExactlyInAnyOrder("Important", "Urgent");
    }

    @Test
    void findByType_WithMaterieType_ShouldReturnMaterieTags() {
        // Arrange
        tagRepository.save(new Tag("Baze de Date", TagType.MATERIE));
        tagRepository.save(new Tag("Structuri de Date", TagType.MATERIE));
        tagRepository.save(new Tag("POO", TagType.MATERIE));
        tagRepository.save(new Tag("Important", TagType.GENERAL));
        entityManager.flush();

        // Act
        List<Tag> materieTags = tagRepository.findByType(TagType.MATERIE);

        // Assert
        assertThat(materieTags).hasSize(3);
        assertThat(materieTags).allMatch(tag -> tag.getType() == TagType.MATERIE);
        assertThat(materieTags).extracting(Tag::getName)
                .containsExactlyInAnyOrder("POO", "Baze de Date", "Structuri de Date");
    }

    @Test
    void findByType_WithAnType_ShouldReturnAnTags() {
        // Arrange
        tagRepository.save(new Tag("Anul 1", TagType.AN));
        tagRepository.save(new Tag("Anul 2", TagType.AN));
        tagRepository.save(new Tag("Anul 3", TagType.AN));
        tagRepository.save(new Tag("General", TagType.GENERAL));
        entityManager.flush();

        // Act
        List<Tag> anTags = tagRepository.findByType(TagType.AN);

        // Assert
        assertThat(anTags).hasSize(3);
        assertThat(anTags).allMatch(tag -> tag.getType() == TagType.AN);
        assertThat(anTags).extracting(Tag::getName)
                .containsExactlyInAnyOrder("Anul 1", "Anul 2", "Anul 3");
    }

    @Test
    void findByType_WithNoTagsOfType_ShouldReturnEmptyList() {
        // Arrange
        tagRepository.save(new Tag("Important", TagType.GENERAL));
        tagRepository.save(new Tag("POO", TagType.MATERIE));
        tagRepository.save(new Tag("Anul 1", TagType.AN));
        entityManager.flush();

        // Act
        List<Tag> grupaTags = tagRepository.findByType(TagType.GRUPA);

        // Assert
        assertThat(grupaTags).isEmpty();
    }

    @Test
    void findByNameAndType_ShouldReturnSpecificTag() {
        // Arrange
        Tag tag1 = tagRepository.save(new Tag("Important", TagType.GENERAL));
        Tag tag2 = tagRepository.save(new Tag("Programare Orientata Obiect", TagType.MATERIE));
        Tag tag3 = tagRepository.save(new Tag("Anul 2", TagType.AN));
        entityManager.flush();
        entityManager.clear();

        // Act
        Tag found = tagRepository.findByNameAndType("Programare Orientata Obiect", TagType.MATERIE);

        // Assert
        assertThat(found).isNotNull();
        assertThat(found.getName()).isEqualTo("Programare Orientata Obiect");
        assertThat(found.getType()).isEqualTo(TagType.MATERIE);
    }

    @Test
    void findByNameAndType_WithNonExistentName_ShouldReturnNull() {
        // Arrange
        tagRepository.save(new Tag("POO", TagType.MATERIE));
        entityManager.flush();

        // Act
        Tag found = tagRepository.findByNameAndType("Fizica", TagType.MATERIE);

        // Assert
        assertThat(found).isNull();
    }

    @Test
    void findByNameAndType_WithWrongType_ShouldReturnNull() {
        // Arrange
        tagRepository.save(new Tag("Programare Orientata Obiect", TagType.MATERIE));
        entityManager.flush();

        // Act
        Tag found = tagRepository.findByNameAndType("Programare Orientata Obiect", TagType.GENERAL);

        // Assert
        assertThat(found).isNull();
    }

    @Test
    void findByNameAndType_WithSameNameDifferentType_ShouldReturnCorrectTag() {
        // Arrange
        tagRepository.save(new Tag("A", TagType.GENERAL));
        tagRepository.save(new Tag("A", TagType.SEMIAN));
        entityManager.flush();

        // Act
        Tag foundGeneral = tagRepository.findByNameAndType("A", TagType.GENERAL);
        Tag foundSemian = tagRepository.findByNameAndType("A", TagType.SEMIAN);

        // Assert
        assertThat(foundGeneral).isNotNull();
        assertThat(foundGeneral.getType()).isEqualTo(TagType.GENERAL);

        assertThat(foundSemian).isNotNull();
        assertThat(foundSemian.getType()).isEqualTo(TagType.SEMIAN);
    }

    @Test
    void findAll_ShouldReturnAllTags() {
        // Arrange
        tagRepository.save(new Tag("Important", TagType.GENERAL));
        tagRepository.save(new Tag("Urgent", TagType.GENERAL));
        tagRepository.save(new Tag("POO", TagType.MATERIE));
        tagRepository.save(new Tag("Anul 2", TagType.AN));
        tagRepository.save(new Tag("Semianul A", TagType.SEMIAN));
        tagRepository.save(new Tag("Grupa 1", TagType.GRUPA));
        entityManager.flush();

        // Act
        List<Tag> allTags = tagRepository.findAll();

        // Assert
        assertThat(allTags).hasSize(6);
        assertThat(allTags).extracting(Tag::getName)
                .containsExactlyInAnyOrder("Important", "Urgent", "POO",
                        "Anul 2", "Semianul A", "Grupa 1");
    }

    @Test
    void findAll_WithEmptyDatabase_ShouldReturnEmptyList() {
        // Act
        List<Tag> allTags = tagRepository.findAll();

        // Assert
        assertThat(allTags).isEmpty();
    }

    @Test
    void update_ShouldModifyExistingTag() {
        // Arrange
        Tag tag = new Tag("Programare Orientata Obiect", TagType.MATERIE);
        Tag persisted = tagRepository.save(tag);
        entityManager.flush();
        entityManager.clear();

        // Act
        Tag toUpdate = tagRepository.findById(persisted.getId()).get();
        toUpdate.setName("POO");
        Tag updated = tagRepository.save(toUpdate);
        entityManager.flush();
        entityManager.clear();

        // Assert
        Tag found = tagRepository.findById(updated.getId()).get();
        assertThat(found.getName()).isEqualTo("POO");
        assertThat(found.getType()).isEqualTo(TagType.MATERIE);
    }

    @Test
    void deleteById_ShouldRemoveTag() {
        // Arrange
        Tag tag = new Tag("Anul 2", TagType.AN);
        Tag persisted = tagRepository.save(tag);
        entityManager.flush();
        Long tagId = persisted.getId();

        // Act
        tagRepository.deleteById(tagId);
        entityManager.flush();

        // Assert
        Optional<Tag> found = tagRepository.findById(tagId);
        assertThat(found).isEmpty();
    }

    @Test
    void delete_ShouldRemoveTag() {
        // Arrange
        Tag tag = new Tag("Grupa 1", TagType.GRUPA);
        Tag persisted = tagRepository.save(tag);
        entityManager.flush();

        // Act
        tagRepository.delete(persisted);
        entityManager.flush();

        // Assert
        Optional<Tag> found = tagRepository.findById(persisted.getId());
        assertThat(found).isEmpty();
    }

    @Test
    void deleteAll_ShouldRemoveAllTags() {
        // Arrange
        tagRepository.save(new Tag("Important", TagType.GENERAL));
        tagRepository.save(new Tag("POO", TagType.MATERIE));
        tagRepository.save(new Tag("Anul 1", TagType.AN));
        entityManager.flush();

        // Act
        tagRepository.deleteAll();
        entityManager.flush();

        // Assert
        List<Tag> allTags = tagRepository.findAll();
        assertThat(allTags).isEmpty();
    }

    @Test
    void count_ShouldReturnNumberOfTags() {
        // Arrange
        tagRepository.save(new Tag("Important", TagType.GENERAL));
        tagRepository.save(new Tag("Urgent", TagType.GENERAL));
        tagRepository.save(new Tag("POO", TagType.MATERIE));
        tagRepository.save(new Tag("Anul 2", TagType.AN));
        entityManager.flush();

        // Act
        long count = tagRepository.count();

        // Assert
        assertThat(count).isEqualTo(4);
    }

    @Test
    void existsById_ShouldReturnTrueForExistingTag() {
        // Arrange
        Tag tag = new Tag("Semianul A", TagType.SEMIAN);
        Tag persisted = tagRepository.save(tag);
        entityManager.flush();

        // Act
        boolean exists = tagRepository.existsById(persisted.getId());

        // Assert
        assertThat(exists).isTrue();
    }

    @Test
    void existsById_ShouldReturnFalseForNonExistingTag() {
        // Act
        boolean exists = tagRepository.existsById(999L);

        // Assert
        assertThat(exists).isFalse();
    }

    @Test
    void saveAll_ShouldPersistMultipleTags() {
        // Arrange
        List<Tag> tagsToSave = List.of(
                new Tag("Important", TagType.GENERAL),
                new Tag("POO", TagType.MATERIE),
                new Tag("Anul 2", TagType.AN),
                new Tag("Semianul B", TagType.SEMIAN),
                new Tag("Grupa 2", TagType.GRUPA)
        );

        // Act
        List<Tag> savedTags = tagRepository.saveAll(tagsToSave);
        entityManager.flush();

        // Assert
        assertThat(savedTags).hasSize(5);
        assertThat(savedTags).allMatch(tag -> tag.getId() != null);
        assertThat(tagRepository.count()).isEqualTo(5);
    }

    @Test
    void findAll_ShouldReturnAllTags_Debug() {
        // Arrange - First ensure database is empty
        tagRepository.deleteAll();
        entityManager.flush();

        // Print initial count
        System.out.println("Initial count: " + tagRepository.count());

        Tag tag1 = tagRepository.save(new Tag("Important", TagType.GENERAL));
        Tag tag2 = tagRepository.save(new Tag("Urgent", TagType.GENERAL));
        Tag tag3 = tagRepository.save(new Tag("POO", TagType.MATERIE));
        Tag tag4 = tagRepository.save(new Tag("Anul 2", TagType.AN));
        Tag tag5 = tagRepository.save(new Tag("Semianul A", TagType.SEMIAN));
        Tag tag6 = tagRepository.save(new Tag("Grupa 1", TagType.GRUPA));
        entityManager.flush();

        // Print count after saving
        System.out.println("Count after saving: " + tagRepository.count());

        // Act
        List<Tag> allTags = tagRepository.findAll();

        // Debug output
        System.out.println("Found " + allTags.size() + " tags:");
        allTags.forEach(tag -> System.out.println("  - " + tag.getName() + " (" + tag.getType() + ")"));

        // Assert
        assertThat(allTags).hasSize(6);

        // Check if all expected tags are present
        boolean hasImportant = allTags.stream().anyMatch(t -> "Important".equals(t.getName()));
        boolean hasUrgent = allTags.stream().anyMatch(t -> "Urgent".equals(t.getName()));
        boolean hasPOO = allTags.stream().anyMatch(t -> "POO".equals(t.getName()));
        boolean hasAnul2 = allTags.stream().anyMatch(t -> "Anul 2".equals(t.getName()));
        boolean hasSemianulA = allTags.stream().anyMatch(t -> "Semianul A".equals(t.getName()));
        boolean hasGrupa1 = allTags.stream().anyMatch(t -> "Grupa 1".equals(t.getName()));

        assertThat(hasImportant).isTrue();
        assertThat(hasUrgent).isTrue();
        assertThat(hasPOO).isTrue();
        assertThat(hasAnul2).isTrue();
        assertThat(hasSemianulA).isTrue();
        assertThat(hasGrupa1).isTrue();
    }

    @Test
    void findByType_ShouldTestAllTagTypes() {
        // Arrange
        tagRepository.save(new Tag("Important", TagType.GENERAL));
        tagRepository.save(new Tag("Programare Orientata Obiect", TagType.MATERIE));
        tagRepository.save(new Tag("Anul 2", TagType.AN));
        tagRepository.save(new Tag("Semianul A", TagType.SEMIAN));
        tagRepository.save(new Tag("Grupa 1", TagType.GRUPA));
        entityManager.flush();

        // Act & Assert for each type
        List<Tag> generalTags = tagRepository.findByType(TagType.GENERAL);
        assertThat(generalTags).hasSize(1);
        assertThat(generalTags.get(0).getName()).isEqualTo("Important");

        List<Tag> materieTags = tagRepository.findByType(TagType.MATERIE);
        assertThat(materieTags).hasSize(1);
        assertThat(materieTags.get(0).getName()).isEqualTo("Programare Orientata Obiect");

        List<Tag> anTags = tagRepository.findByType(TagType.AN);
        assertThat(anTags).hasSize(1);
        assertThat(anTags.get(0).getName()).isEqualTo("Anul 2");

        List<Tag> semianTags = tagRepository.findByType(TagType.SEMIAN);
        assertThat(semianTags).hasSize(1);
        assertThat(semianTags.get(0).getName()).isEqualTo("Semianul A");

        List<Tag> grupaTags = tagRepository.findByType(TagType.GRUPA);
        assertThat(grupaTags).hasSize(1);
        assertThat(grupaTags.get(0).getName()).isEqualTo("Grupa 1");
    }
}