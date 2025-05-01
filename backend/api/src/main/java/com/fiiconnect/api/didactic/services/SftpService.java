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
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Objects;
import java.util.UUID;


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

    public void uploadFile(MultipartFile multipartFile, String remoteTargetDir) throws IOException {
        File file = null;
        try {
            // Convert MultipartFile to File
            file = convertToFile(multipartFile);

            // Send to SFTP via outboundChannel
            outboundChannel.send(MessageBuilder.withPayload(file)
                    .setHeader("remote-target-dir", remoteTargetDir)
                    .build());
        } catch (IOException e) {
            throw new IOException("Failed to process file: " + multipartFile.getOriginalFilename(), e);
        } catch (Exception e) {
            throw new RuntimeException("Unexpected error during SFTP upload", e);
        } finally {
            if (file != null && file.exists()) {
                file.delete();
            }
        }
    }

    public File downloadFile(String remoteFilePath) throws IOException
    {
        return this.downloadFile(remoteFilePath, new File(remoteFilePath).getName());
    }

    public File downloadFile(String remoteFilePath, String localPath) throws IOException {
        File localFile = new File(localDir, localPath);

        try {
            sftpRemoteFileTemplate.execute(session -> {
                try {
                    if (!session.exists(remoteFilePath)) {
                        throw new FileNotFoundException("Remote file not found: " + remoteFilePath);
                    }

                    try (OutputStream os = new FileOutputStream(localFile)) {
                        session.read(remoteFilePath, os);
                    }

                } catch (IOException e) {
                    throw new IOException("I/O error while reading remote file: " + remoteFilePath, e);
                } catch (Exception e) {
                    throw new RuntimeException("SFTP session error during file download", e);
                }
                return null;
            });
        } catch (RuntimeException e) {
            // Re-throw specific causes
            if (e.getCause() instanceof FileNotFoundException) {
                throw (FileNotFoundException) e.getCause();
            } else if (e.getCause() instanceof IOException) {
                throw (IOException) e.getCause();
            }
            throw e;
        }

        return localFile;
    }

    public void deleteFile(String remoteFilePath) throws IOException {
        try {
            sftpRemoteFileTemplate.execute(session -> {
                    if (!session.exists(remoteFilePath)) {
                        throw new FileNotFoundException("Remote file not found: " + remoteFilePath);
                    }
                    session.remove(remoteFilePath);
                return null;
            });
        } catch (RuntimeException e) {
            if (e.getCause() instanceof FileNotFoundException) {
                throw (FileNotFoundException) e.getCause();
            } else if (e.getCause() instanceof IOException) {
                throw (IOException) e.getCause();
            }
            throw e;
        }
    }

    private File convertToFile(MultipartFile multipartFile) throws IOException {
        if (multipartFile.isEmpty()) {
            throw new IOException("Cannot convert empty MultipartFile to file.");
        }

        Path tempPath = Path.of(System.getProperty("java.io.tmpdir"), Objects.requireNonNull(multipartFile.getOriginalFilename()));
        Files.write(tempPath, multipartFile.getBytes());
        return tempPath.toFile();
    }


}
