package com.fiiconnect.api.social_secretary_test.config;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.mockito.Mockito;
import com.fiiconnect.api.social_secretary.service.*;
import com.fiiconnect.api.auth_userMgmt.repositories.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@TestConfiguration
public class TestConfig {

    @Bean
    @Primary
    public AchievementService mockAchievementService() {
        return Mockito.mock(AchievementService.class);
    }

    @Bean
    @Primary
    public AnnouncementService mockAnnouncementService() {
        return Mockito.mock(AnnouncementService.class);
    }

    @Bean
    @Primary
    public ChannelService mockChannelService() {
        return Mockito.mock(ChannelService.class);
    }

    @Bean
    @Primary
    public ChatService mockChatService() {
        return Mockito.mock(ChatService.class);
    }

    @Bean
    @Primary
    public TagService mockTagService() {
        return Mockito.mock(TagService.class);
    }

    @Bean
    @Primary
    public UserRepository mockUserRepository() {
        return Mockito.mock(UserRepository.class);
    }

    @Bean
    @Primary
    public SimpMessagingTemplate mockMessagingTemplate() {
        return Mockito.mock(SimpMessagingTemplate.class);
    }
}