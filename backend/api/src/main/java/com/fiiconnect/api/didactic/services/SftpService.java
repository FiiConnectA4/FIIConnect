package com.fiiconnect.api.didactic.services;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.integration.sftp.session.SftpRemoteFileTemplate;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.OutputStream;

@Service
public class SftpService {

    private final SftpRemoteFileTemplate sftpRemoteFileTemplate;
    private final MessageChannel outboundChannel;
    @Value("${sftp.inbound.local.dir}")
    private String localDir;

    public SftpService(SftpRemoteFileTemplate sftpRemoteFileTemplate, @Qualifier("outboundChannel") MessageChannel outboundChannel) {
        this.sftpRemoteFileTemplate = sftpRemoteFileTemplate;
        this.outboundChannel = outboundChannel;
    }

    public void uploadFile(MultipartFile multipartFile, String remoteTargetDir) throws Exception {
        // Convert MultipartFile to File
        File file = convertToFile(multipartFile);

        // Send to SFTP via outboundChannel
        outboundChannel.send(MessageBuilder.withPayload(file)
                .setHeader("remote-target-dir", remoteTargetDir)
                .build());

        // Clean up the temp file after sending
        file.delete();
    }

    public File downloadFile(String remoteFilePath) {


        // Define the local file where the file will be saved
        File localFile = new File(localDir, new File(remoteFilePath).getName());

        // Perform the SFTP download
        sftpRemoteFileTemplate.execute(session -> {
            try {
                // Check if the remote file exists
                if (session.exists(remoteFilePath)) {
                    // Create the output stream to the local file
                    try (OutputStream os = new FileOutputStream(localFile)) {
                        // Read the file from the remote server and write it to the local file
                        session.read(remoteFilePath, os);
                    }
                } else {
                    throw new FileNotFoundException("Remote file not found: " + remoteFilePath);
                }
            } catch (Exception e) {
                // Handle exceptions, such as file not found or session issues
                throw new RuntimeException("Failed to download file from SFTP server", e);
            }
            return null;
        });

        // Return the downloaded local file
        return localFile;
    }

    private File convertToFile(MultipartFile multipartFile) throws Exception {
        File convFile = new File(System.getProperty("java.io.tmpdir") + "/" + multipartFile.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(convFile)) {
            fos.write(multipartFile.getBytes());
        }
        return convFile;
    }
}
