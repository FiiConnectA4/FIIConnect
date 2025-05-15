package com.fiiconnect.api.didactic.services;

import lombok.Getter;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.integration.sftp.session.SftpRemoteFileTemplate;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.support.MessageBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Objects;

@Service
public class SftpService {

    @Getter
    private final SftpRemoteFileTemplate sftpRemoteFileTemplate;
    private final MessageChannel outboundChannel;

    @Value("${sftp.inbound.local.dir}")
    private String localDir;

    public SftpService(SftpRemoteFileTemplate sftpRemoteFileTemplate,
                       @Qualifier("outboundChannel") MessageChannel outboundChannel) {
        this.sftpRemoteFileTemplate = sftpRemoteFileTemplate;
        this.outboundChannel = outboundChannel;
    }

    public void uploadFile(MultipartFile multipartFile, String remoteTargetDir, String... desiredFileName) throws IOException {
        File file = null;
        try {
            assert desiredFileName.length <= 1;
            String desiredName = desiredFileName.length > 0 ? desiredFileName[0] : null;
            file = convertToFile(multipartFile, desiredName);
            outboundChannel.send(MessageBuilder.withPayload(file)
                    .setHeader("remote-target-dir", remoteTargetDir)
                    .build());
        } catch (IOException e) {
            throw new IOException("Failed to process file: " + multipartFile.getOriginalFilename(), e);
        } finally {
            if (file != null && file.exists()) {
                if (!file.delete())
                    System.err.println("Failed to delete temp file: " + file.getAbsolutePath());
            }
        }
    }

    public File downloadFile(String remoteFilePath) throws IOException {
        return this.downloadFile(remoteFilePath, new File(remoteFilePath).getName());
    }

    public File downloadFile(String remoteFilePath, String localPath) throws IOException {
        Path basePath = Paths.get(localDir).toAbsolutePath().normalize();
        Path targetPath = basePath.resolve(localPath).normalize();

        Files.createDirectories(targetPath.getParent());

        File localFile = targetPath.toFile();

        sftpRemoteFileTemplate.execute(session -> {
            if (!session.exists(remoteFilePath)) {
                throw new FileNotFoundException("Remote file not found: " + remoteFilePath);
            }
            try (OutputStream os = new FileOutputStream(localFile)) {
                session.read(remoteFilePath, os);
            } catch (IOException e) {
                throw new RuntimeException("I/O error while reading remote file: " + remoteFilePath, e);
            }
            return null;
        });

        return localFile;
    }

    public boolean checkExists(String remoteFilePath) throws IOException {
        try {
            sftpRemoteFileTemplate.execute(session -> {
                if (!session.exists(remoteFilePath)) {
                    throw new FileNotFoundException("Remote file not found: " + remoteFilePath);
                }
                return null;
            });
        } catch (RuntimeException e) {
            if (e.getCause() instanceof FileNotFoundException) return false;
            if (e.getCause() instanceof IOException) throw (IOException) e.getCause();
            throw e;
        }
        return true;
    }

    public void deleteFile(String remoteFilePath, boolean isDirectory) throws IOException {
        sftpRemoteFileTemplate.execute(session -> {
            if (!session.exists(remoteFilePath)) {
                throw new FileNotFoundException("Remote file not found: " + remoteFilePath);
            }
            if (!isDirectory) {
                session.remove(remoteFilePath);
            } else {
                session.rmdir(remoteFilePath);
            }
            return null;
        });
    }

    public void renameFile(String originalFilePath, String newFilePath) throws IOException {
        sftpRemoteFileTemplate.execute(session -> {
            if (!session.exists(originalFilePath)) {
                throw new FileNotFoundException("Remote file not found: " + originalFilePath);
            }
            session.rename(originalFilePath, newFilePath);
            return null;
        });
    }

    private File convertToFile(MultipartFile multipartFile, String... desiredFileName) throws IOException {
        if (multipartFile.isEmpty()) {
            throw new IOException("Cannot convert empty MultipartFile to file.");
        }
        String fileName = (desiredFileName.length > 0 && desiredFileName[0] != null)
                ? desiredFileName[0]
                : Objects.requireNonNull(multipartFile.getOriginalFilename());
        Path tempPath = Files.createTempFile("upload_", "_" + fileName);
        Files.write(tempPath, multipartFile.getBytes());
        return tempPath.toFile();
    }

    public byte[] readFileAsByteArray(String remoteFilePath) throws IOException {
        return sftpRemoteFileTemplate.execute(session -> {
            if (!session.exists(remoteFilePath)) {
                throw new FileNotFoundException("Remote file not found: " + remoteFilePath);
            }
            try (ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
                session.read(remoteFilePath, outputStream);
                return outputStream.toByteArray();
            } catch (IOException e) {
                throw new RuntimeException("I/O error while reading remote file: " + remoteFilePath, e);
            }
        });
    }

}
