package com.fiiconnect.api.didactic.configs;

import org.apache.sshd.sftp.client.SftpClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.integration.channel.DirectChannel;
import org.springframework.integration.dsl.IntegrationFlow;
import org.springframework.integration.file.remote.session.SessionFactory;
import org.springframework.integration.file.support.FileExistsMode;
import org.springframework.integration.sftp.dsl.Sftp;
import org.springframework.messaging.MessageChannel;

import java.io.File;

@Configuration
public class SftpOutboundConfig {
    @Autowired
    private SessionFactory<SftpClient.DirEntry> sessionFactory;

    @Bean
    public MessageChannel outboundChannel() {
        return new DirectChannel();
    }

    @Bean
    public IntegrationFlow outboundConfig() {
        return IntegrationFlow.from("outboundChannel")
                .handle(Sftp.outboundAdapter(sessionFactory, FileExistsMode.REPLACE)
                        .useTemporaryFileName(false)    // prevent temp files
                        .remoteDirectoryExpression("headers['remote-target-dir']")
                        .remoteFileSeparator("/")        // normal separator
                        .autoCreateDirectory(true)
                        .fileNameGenerator(message -> {
                            Object payload = message.getPayload();
                            if (payload instanceof File) {
                                return ((File) payload).getName();
                            }
                            throw new IllegalArgumentException("Payload is not a file.");
                        })
                )
                .get();

    }
}