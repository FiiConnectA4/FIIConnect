package com.fiiconnect.api.didactic.configs;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.sftp.session.SftpRemoteFileTemplate;
import org.springframework.integration.file.remote.session.SessionFactory;
import org.apache.sshd.sftp.client.SftpClient;

@Configuration
public class SftpTemplateConfig {

    private final SessionFactory<SftpClient.DirEntry> sessionFactory;

    public SftpTemplateConfig(SessionFactory<SftpClient.DirEntry> sessionFactory) {
        this.sessionFactory = sessionFactory;
    }

    @Bean
    public SftpRemoteFileTemplate sftpRemoteFileTemplate() {
        return new SftpRemoteFileTemplate(sessionFactory);
    }
}
