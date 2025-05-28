
// IntelliJ API Decompiler stub source generated from a class file
// Implementation of methods is not available

package com.fiiconnect.api.socialsecretary;

@org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest
@org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase(replace = org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace.NONE)
public class ChannelRepositoryTest {
    @org.springframework.beans.factory.annotation.Autowired
    private com.fiiconnect.api.social_secretary.repository.ChannelRepository channelRepository;
    @org.springframework.beans.factory.annotation.Autowired
    private jakarta.persistence.EntityManager entityManager;

    public ChannelRepositoryTest() { /* compiled code */ }

    @org.junit.jupiter.api.Test
    @jakarta.transaction.Transactional
    @org.springframework.test.annotation.Rollback
    public void testFindAllChannelsWithTag() { /* compiled code */ }
}