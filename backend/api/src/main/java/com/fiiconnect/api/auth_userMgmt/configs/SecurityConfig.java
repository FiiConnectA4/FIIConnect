package com.fiiconnect.api.auth_userMgmt.configs;

import com.fiiconnect.api.auth_userMgmt.services.CustomUserDetailsService;
import com.fiiconnect.api.auth_userMgmt.validators.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(CustomUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    /* ────────────────────────────────────────────────────────────────────────
       1.  BEANS
       ──────────────────────────────────────────────────────────────────────── */

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /** DaoAuthenticationProvider → folosit de AuthenticationManager
     *  (chiar dacă intri doar cu JWT, e bine pt. /login) */
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration cfg) throws Exception {
        return cfg.getAuthenticationManager();
    }

    /* ────────────────────────────────────────────────────────────────────────
       2.  CORS
       ──────────────────────────────────────────────────────────────────────── */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cors = new CorsConfiguration();
        cors.setAllowedOriginPatterns(List.of("http://localhost:3000")); // wildcard-ready
        cors.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        cors.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        cors.setAllowCredentials(true);
        cors.setMaxAge(3600L); // pre-flight cache 1h

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cors);
        return source;
    }

    /* ────────────────────────────────────────────────────────────────────────
       3.  SECURITY FILTER CHAIN
       ──────────────────────────────────────────────────────────────────────── */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .formLogin(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)

                /* ————————————————— AUTH RULES ————————————————— */
                .authorizeHttpRequests(auth -> auth
                        // public WebSocket handshake (token e în query param)
                        .requestMatchers("/ws/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/profile/photo").permitAll()
                        // auth endpoints
                        .requestMatchers(HttpMethod.POST, "/users/login", "/users/forgot-password", "/users/reset-password")
                        .permitAll()
                        .requestMatchers(HttpMethod.POST, "/users/register", "/users/role")
                        .hasRole("ADMIN")

                        .anyRequest().authenticated()
                )

                /* ————————————————— FILTERS ————————————————— */
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)

                /* ————————————————— LOGOUT ————————————————— */
                .logout(logout -> logout.logoutUrl("/users/logout").permitAll());

        /*  Atașăm provider-ul explicit;
            nu e obligatoriu, dar evită ambiguități când ai mai mulți */
        http.authenticationProvider(authenticationProvider());

        return http.build();
    }
}
