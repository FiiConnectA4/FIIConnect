package com.fiiconnect.api.social_secretary.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

import com.fiiconnect.api.auth_userMgmt.services.JwtService;
import com.fiiconnect.api.auth_userMgmt.services.JwtHandshakeInterceptor;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtService jwtService;

    public WebSocketConfig(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry
                .addEndpoint("/ws")
                .addInterceptors(new JwtHandshakeInterceptor(jwtService))
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // 1) Prefix pentru destinațiile “de aplicație” (trimise de client cu /app/…)
        registry.setApplicationDestinationPrefixes("/app");

        // 2) Prefix pentru mesajele “user‐specific”.
        //    ConvertAndSendToUser("/queue/notifications") va ajunge la "/user/{username}/queue/notifications"
        registry.setUserDestinationPrefix("/user");

        // 3) Activăm brokerul simplu pentru /topic și /queue (toate destinațiile unde vrem să primească clientul)
        registry.enableSimpleBroker("/topic", "/queue", "/topic/channel");
        //    - "/topic" (dacă ai publish/generic topics)
        //    - "/queue" (destinații unicast pe fiecare user, ex. "/user/{username}/queue/notifications")
        //    - "/topic/channel" (orice alt topic specific ție, dacă ai nevoie)
    }
}
