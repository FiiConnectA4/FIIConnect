package com.fiiconnect.api.social_secretary;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User_Anunturi, Long> {
    User_Anunturi findByName (String name);
}