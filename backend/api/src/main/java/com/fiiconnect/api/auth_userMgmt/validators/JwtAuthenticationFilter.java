package com.fiiconnect.api.auth_userMgmt.validators;

import com.fiiconnect.api.auth_userMgmt.services.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;  // Import corect

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        // Dacă nu avem Authorization header sau nu începe cu Bearer, trecem mai departe
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7); // Scoatem "Bearer "
        username = jwtService.extractUsername(jwt);

        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            if (jwtService.isTokenValid(jwt, username)) {
                // Extragem rolurile din JWT
                List<String> roles = jwtService.extractClaim(jwt, claims -> claims.get("roles", List.class));

                if (roles != null) {
                    // Mapăm rolurile într-o listă de SimpleGrantedAuthority
                    List<GrantedAuthority> authorities = roles.stream()
                            .map(SimpleGrantedAuthority::new)
                            .collect(Collectors.toList());

                    // Creăm un token de autentificare
                    UserDetails userDetails = new org.springframework.security.core.userdetails.User(username, "", authorities);

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(userDetails, null, authorities);


                    // Setăm detaliile autentificării
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Setăm autentificarea în contextul de securitate
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        }

        // Continuăm cu filtrul
        filterChain.doFilter(request, response);
    }
}
