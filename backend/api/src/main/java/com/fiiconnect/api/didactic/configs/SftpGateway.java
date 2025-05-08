package com.fiiconnect.api.didactic.configs;

import org.springframework.integration.annotation.Gateway;
import org.springframework.integration.annotation.MessagingGateway;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;

import java.io.File;

@MessagingGateway
public interface SftpGateway {

   // @Gateway(requestChannel = "outboundChannel")
   // void sendFile(@Payload File file, @Header("remote-target-dir") String targetDir);

   // @Gateway(requestChannel = "sftpInboundChannel")
   // File receiveFile(@Header("remote-target-dir") String targetDir);
}
