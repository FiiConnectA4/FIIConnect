package com.fiiconnect.api.didactic.controllers;

import com.fiiconnect.api.didactic.services.SftpService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import org.springframework.http.HttpStatus;
import java.io.FileNotFoundException;
import java.io.IOException;



@RestController
@RequestMapping("/sftp")
public class SftpController {

    private final SftpService sftpService;

    public SftpController(SftpService sftpService) {
        this.sftpService = sftpService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        try {
            if (file.isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Uploaded file is empty.");
            }

            String remoteTargetDir = "/faculty_files/";
            sftpService.uploadFile(file, remoteTargetDir);
            return ResponseEntity.ok("File uploaded successfully.");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid file input: " + e.getMessage() + " - " + e.getCause());
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Permission denied: " + e.getMessage() + " - " + e.getCause());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to upload file: " + e.getMessage() + " - " + e.getCause());
        }
    }

    @GetMapping("/download")
    public ResponseEntity<String> downloadFile(@RequestParam String remoteFile) {
        try {
            if (remoteFile == null || remoteFile.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing or invalid remote file name.");
            }

            File downloadedFile = sftpService.downloadFile("/faculty_files/" + remoteFile);
            return ResponseEntity.ok("File downloaded to: " + downloadedFile.getAbsolutePath());
        } catch (FileNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found: " + e.getMessage() + " - " + e.getCause());
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("I/O error during download: " + e.getMessage() + " - " + e.getCause());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to download file: " + e.getMessage() + " - " + e.getCause());
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<String> deleteFile(@RequestParam String remoteFile) {
        try {
            if (remoteFile == null || remoteFile.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Missing or invalid remote file name.");
            }

            String remoteFilePath = "faculty_files/" + remoteFile;
            sftpService.deleteFile(remoteFilePath, false);
            return ResponseEntity.ok("File deleted successfully.");
        } catch (FileNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("File not found: " + e.getMessage() + " - " + e.getCause());
        } catch (SecurityException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Permission denied to delete file: " + e.getMessage() + " - " + e.getCause());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to delete file: " + e.getMessage() + " - " + e.getCause());
        }
    }

}
