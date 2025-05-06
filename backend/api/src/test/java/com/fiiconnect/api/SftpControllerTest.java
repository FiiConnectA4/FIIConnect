package com.fiiconnect.api;

import com.fiiconnect.api.didactic.controllers.SftpController;
import com.fiiconnect.api.didactic.services.SftpService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class SftpControllerTest {

    @Mock
    private SftpService sftpService;

    @InjectMocks
    private SftpController controller;

    private MultipartFile file;

    @BeforeEach
    void setUp() {
        // Mock a MultipartFile for testing
        file = mock(MultipartFile.class);
    }

    @Test
    void uploadFile_ReturnsOk_WhenFileIsUploaded() throws IOException {
        when(file.isEmpty()).thenReturn(false);

        // Mock the upload service call
        doNothing().when(sftpService).uploadFile(any(), any());

        ResponseEntity<String> result = controller.uploadFile(file);

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals("File uploaded successfully.", result.getBody());
        verify(sftpService, times(1)).uploadFile(file, "/faculty_files/");
    }

    @Test
    void uploadFile_ReturnsBadRequest_WhenFileIsEmpty() throws IOException {
        when(file.isEmpty()).thenReturn(true);

        ResponseEntity<String> result = controller.uploadFile(file);

        assertEquals(HttpStatus.BAD_REQUEST, result.getStatusCode());
        assertEquals("Uploaded file is empty.", result.getBody());
        verify(sftpService, never()).uploadFile(any(), any());
    }

    @Test
    void downloadFile_ReturnsOk_WhenFileIsDownloaded() throws Exception {
        String remoteFile = "file.txt";
        File localFile = new File("/local/path/file.txt");

        when(sftpService.downloadFile("/faculty_files/" + remoteFile)).thenReturn(localFile);

        ResponseEntity<String> result = controller.downloadFile(remoteFile);

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals("File downloaded to: " + localFile.getAbsolutePath(), result.getBody());
        verify(sftpService, times(1)).downloadFile("/faculty_files/" + remoteFile);
    }

    @Test
    void downloadFile_ReturnsNotFound_WhenFileDoesNotExist() throws Exception {
        String remoteFile = "nonexistent.txt";

        when(sftpService.downloadFile("/faculty_files/" + remoteFile)).thenThrow(new FileNotFoundException("File not found"));

        ResponseEntity<String> result = controller.downloadFile(remoteFile);

        assertEquals(HttpStatus.NOT_FOUND, result.getStatusCode());
        assertTrue(result.getBody().contains("File not found"));
        verify(sftpService, times(1)).downloadFile("/faculty_files/" + remoteFile);
    }

    @Test
    void deleteFile_ReturnsOk_WhenFileIsDeleted() throws IOException {
        String remoteFile = "file.txt";

        doNothing().when(sftpService).deleteFile("/faculty_files/" + remoteFile, false);

        ResponseEntity<String> result = controller.deleteFile(remoteFile);

        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals("File deleted successfully.", result.getBody());
        verify(sftpService, times(1)).deleteFile("/faculty_files/" + remoteFile, false);
    }

    @Test
    void deleteFile_ReturnsNotFound_WhenFileDoesNotExist() throws Exception {
        String remoteFile = "test";

        doThrow(new FileNotFoundException("Remote file not found: /faculty_files/" + remoteFile))
                .when(sftpService).deleteFile("/faculty_files/" + remoteFile, false);

        ResponseEntity<String> response = controller.deleteFile(remoteFile);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertTrue(response.getBody().contains("File not found"));

        verify(sftpService, times(1)).deleteFile("/faculty_files/" + remoteFile, false);
    }

}

