package com.fiiconnect.api.social_secretary.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS(); // fallback pentru browsere fără WebSocket
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Prefix pentru mesaje de la client spre server
        registry.setApplicationDestinationPrefixes("/app");

        // Prefixuri pentru mesaje din server spre client
        registry.enableSimpleBroker("/topic", "/queue");

        // Suport pentru canale private: ex /user/queue/notifications
        registry.setUserDestinationPrefix("/user");
    }
}
