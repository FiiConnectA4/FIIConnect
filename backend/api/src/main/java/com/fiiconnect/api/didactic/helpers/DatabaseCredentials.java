package com.fiiconnect.api.didactic.helpers;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Setter
@Getter
@ConfigurationProperties(prefix = "spring.datasource")
@Configuration
//used for cases where the db username is necessary
public class DatabaseCredentials {
    private String username;
    private String password;
}
