package com.fiiconnect.api.didactic.configs;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;


@Getter
@Setter
@Configuration
@ConfigurationProperties(prefix = "sftp")
public class SftpServerInfo {
    private String host;
    private Integer port;
    private String username;
    private String password;
    private String privateKeyPath;
    private String privateKeyPassphrase;
}