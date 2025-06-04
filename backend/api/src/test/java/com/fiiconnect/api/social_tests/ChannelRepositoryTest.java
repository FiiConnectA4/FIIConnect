package com.fiiconnect.api.social_tests;

import static org.junit.jupiter.api.Assertions.*;

import com.fiiconnect.api.social_secretary.classes.Channel;
import com.fiiconnect.api.social_secretary.classes.Tag;
import com.fiiconnect.api.social_secretary.enums.TagType;
import com.fiiconnect.api.social_secretary.repository.ChannelRepository;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.annotation.Rollback;

import java.util.List;

@org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
@org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase(replace = org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace.NONE)
public class ChannelRepositoryTest {

    @Autowired
    private ChannelRepository channelRepository;

    @Autowired
    private EntityManager entityManager;

    @Test
    @Transactional
    @Rollback
    public void testFindAllChannelsWithTag() {
        // 1. Creează și salvează un Tag
        Tag tag = new Tag("Test Tag", TagType.GENERAL);
        entityManager.persist(tag);

        // 2. Creează și salvează un Channel, asociindu-i tag-ul
        Channel channel = new Channel();
        channel.setName("Test Channel");
        channel.getTags().add(tag);
        entityManager.persist(channel);

        // Asigură scrierea datelor în baza de date și curățarea contextului de persistență
        entityManager.flush();
        entityManager.clear();

        // 3. Apelează metoda custom din repository
        List<Channel> channels = channelRepository.findAllChannelsWithTag(tag.getId());
        assertNotNull(channels, "Rezultatul nu trebuie să fie null.");
        assertFalse(channels.isEmpty(), "Lista de canale trebuie să conțină cel puțin un element.");

        // 4. Verifică că canalul creat este prezent în rezultat
        boolean found = channels.stream()
                .anyMatch(ch -> "Test Channel".equals(ch.getName()));
        assertTrue(found, "Canalul creat ar trebui să fie găsit în rezultatul interogării.");
    }
}
