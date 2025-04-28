package com.fiiconnect.api.didactic.controllers;

import com.fiiconnect.api.didactic.services.SftpService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

@RestController
@RequestMapping("/sftp")
public class SftpController {

    private final SftpService sftpService;

    public SftpController(SftpService sftpService) {
        this.sftpService = sftpService;
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(
            @RequestParam("file") MultipartFile file) {
        try {
            String remoteTargetDir = "/faculty_files/";
            sftpService.uploadFile(file, remoteTargetDir);
            return ResponseEntity.ok("File uploaded successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to upload file: " + e.getMessage());
        }
    }

    @GetMapping("/download")
    public ResponseEntity<String> downloadFile(@RequestParam String remoteFile) {
        try {
            File downloadedFile = sftpService.downloadFile("/faculty_files/" + remoteFile);
            return ResponseEntity.ok("File downloaded to: " + downloadedFile.getAbsolutePath());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to download file: " + e.getMessage());
        }
    }
}
