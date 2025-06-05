// JwtHandshakeInterceptor.java
package com.fiiconnect.api.auth_userMgmt.services;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus; // Asigură-te că ai acest import
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.security.Principal;
import java.util.Map;

public class JwtHandshakeInterceptor implements HandshakeInterceptor {

    private final JwtService jwtService;

    public JwtHandshakeInterceptor(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes) throws Exception { // Adaugă "throws Exception"

        if (request instanceof ServletServerHttpRequest servletRequest) {
            HttpServletRequest httpServletRequest = servletRequest.getServletRequest();
            String token = httpServletRequest.getParameter("token");

            if (token != null && !token.isBlank()) {
                try {
                    // Extrage username-ul. JwtService ar trebui să arunce o excepție dacă token-ul e malformat/expirat.
                    String username = jwtService.extractUsername(token);

                    // Validează token-ul pentru username-ul extras.
                    // Această metodă ar trebui să verifice semnătura, data de expirare, și dacă username-ul corespunde.
                    if (jwtService.isTokenValid(token, username)) {
                        final String finalUsername = username;
                        Principal principal = () -> finalUsername;
                        attributes.put("principal", principal);
                        // Alternativ, pentru o integrare posibil mai bună cu Spring Security intern
                        // attributes.put(org.springframework.web.socket.WebSocketHandler.PRINCIPAL_SESSION_ATTRIBUTE_NAME, principal);
                        System.out.println("WebSocket handshake: Token valid pentru utilizatorul: " + username + ". Principal setat în atribute.");
                        return true; // Token valid, handshake-ul poate continua
                    } else {
                        System.out.println("WebSocket handshake: Token considerat invalid de jwtService.isTokenValid pentru username: " + username);
                        setUnauthorized(response);
                        return false; // Token invalid, oprește handshake-ul
                    }
                } catch (Exception e) {
                    // Orice excepție din jwtService (token expirat, malformat, semnătură invalidă etc.)
                    System.out.println("WebSocket handshake: Eroare la procesarea token-ului - " + e.getClass().getSimpleName() + ": " + e.getMessage());
                    setUnauthorized(response);
                    return false; // Eroare la procesarea token-ului, oprește handshake-ul
                }
            } else {
                System.out.println("WebSocket handshake: Token-ul (query parameter 'token') nu a fost găsit sau este gol.");
                setUnauthorized(response);
                return false; // Token lipsă, oprește handshake-ul
            }
        }
        System.out.println("WebSocket handshake: Request-ul nu este de tip ServletServerHttpRequest. Handshake oprit.");
        setUnauthorized(response); // Oprește și în acest caz neașteptat
        return false;
    }

    private void setUnauthorized(ServerHttpResponse response) {
        // Încearcă să setezi codul de stare HTTP dacă este posibil.
        // Acest lucru este mai mult informativ pentru client, deoarece conexiunea WebSocket va fi închisă oricum.
        if (response instanceof org.springframework.http.server.ServletServerHttpResponse) {
            ((org.springframework.http.server.ServletServerHttpResponse) response).getServletResponse().setStatus(HttpStatus.UNAUTHORIZED.value());
        }
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {
        if (exception != null) {
            // Acest log este util dacă handshake-ul eșuează *după* ce beforeHandshake a returnat true,
            // sau dacă handler-ul wsHandler aruncă o excepție la inițializare.
            System.out.println("WebSocket handshake: Excepție în faza afterHandshake sau la inițializarea handler-ului: " + exception.getMessage());
        }
    }
}