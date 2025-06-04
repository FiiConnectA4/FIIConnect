package com.fiiconnect.api;

import com.fiiconnect.api.didactic.controllers.CourseMaterialController;
import com.fiiconnect.api.didactic.exceptions.CourseMaterialNotFoundException;
import com.fiiconnect.api.didactic.helpers.SQLExceptionMessageParser;
import com.fiiconnect.api.didactic.models.CourseMaterial;
import com.fiiconnect.api.didactic.repositories.CourseMaterialRepository;
import com.fiiconnect.api.didactic.services.CourseMaterialService;
import com.fiiconnect.api.didactic.services.SftpService;
import org.hibernate.exception.ConstraintViolationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import java.io.IOException;
import java.sql.SQLException;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import static org.junit.jupiter.api.Assertions.*;
@ExtendWith(MockitoExtension.class)
public class CourseMaterialControllerTest {

    @Mock
    private CourseMaterialRepository repository;

    @Mock
    private SQLExceptionMessageParser exceptionHelper;

    @Mock
    private SftpService sftpService;

    @Mock
    private CourseMaterialService service;

    @InjectMocks
    private CourseMaterialController controller;

    private CourseMaterial material;

    @BeforeEach
    void setUp() {
        material = new CourseMaterial(
                1L,
                101L,
                201L,
                "lecture1.pdf",
                new Date(),
                new Date()
        );
    }

    @Test
    void all_ReturnsAllMaterials() {
        when(repository.findAll()).thenReturn(List.of(material));

        List<CourseMaterial> result = controller.all();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(material, result.get(0));
        verify(repository, times(1)).findAll();
    }

    @Test
    void one_ReturnsMaterial_WhenExists() {
        when(repository.findById(1L)).thenReturn(Optional.of(material));

        CourseMaterial result = controller.one(1L);

        assertNotNull(result);
        assertEquals(material, result);
        verify(repository, times(1)).findById(1L);
    }

    @Test
    void one_ThrowsException_WhenNotFound() {
        when(repository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(CourseMaterialNotFoundException.class, () -> controller.one(1L));
        verify(repository, times(1)).findById(1L);
    }

    @Test
    void uploadMaterial_SavesMaterialAndReturns201() throws IOException {
        CourseMaterial input = new CourseMaterial();
        input.setIdCourse(1010L);
//        input.setIdProfessor(2010L);
        input.setFilename("lab1.pdf");
        input.setUploadDate(new Date());
        input.setUpdateDate(new Date());

        CourseMaterial saved = new CourseMaterial();
        saved.setId(2L);  // Set the ID explicitly
        saved.setIdCourse(input.getIdCourse());
        saved.setIdProfessor(input.getIdProfessor());
        saved.setFilename(input.getFilename());
        saved.setUploadDate(input.getUploadDate());
        saved.setUpdateDate(input.getUpdateDate());

        MultipartFile file = mock(MultipartFile.class);
        when(file.getOriginalFilename()).thenReturn("lab1.pdf");

        when(repository.save(any(CourseMaterial.class))).thenReturn(saved);
        doNothing().when(sftpService).uploadFile(any(), any());

        ResponseEntity<?> response = controller.uploadFile(1010L, file);

        assertEquals(201, response.getStatusCode().value());
        verify(repository, times(1)).save(any());
        verify(sftpService, times(1)).uploadFile(any(), any());
    }


    @Test
    void deleteMaterial_DeletesSuccessfully() throws IOException {
        when(repository.findById(1L)).thenReturn(Optional.of(material));
        doNothing().when(service).deleteMaterial(material);

        controller.deleteMaterial(1L);

        verify(repository, times(1)).findById(1L);
        verify(service, times(1)).deleteMaterial(material);
    }

    @Test
    void changeFilename_UpdatesSuccessfully() throws IOException {
        String oldFilename = "lecture1.pdf";
        String newFilename = "lecture1-updated.pdf";
        material.setFilename(oldFilename);

        when(repository.findById(1L)).thenReturn(Optional.of(material));
        when(repository.save(any())).thenReturn(material);
        doNothing().when(sftpService).renameFile(
                "faculty_files/didactic/course-" + material.getIdCourse() + "/materials/" + oldFilename,
                "faculty_files/didactic/course-" + material.getIdCourse() + "/materials/" + newFilename
        );

        controller.changeFilename(1L, newFilename);

        assertEquals(newFilename, material.getFilename());
        verify(repository, times(1)).findById(1L);
        verify(repository, times(1)).save(material);
        verify(sftpService, times(1)).renameFile(
                "faculty_files/didactic/course-" + material.getIdCourse() + "/materials/" + oldFilename,
                "faculty_files/didactic/course-" + material.getIdCourse() + "/materials/" + newFilename
        );
    }

    @Test
    void changeFilename_MaterialNotFound_ThrowsException() throws IOException {
        when(repository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(CourseMaterialNotFoundException.class, () -> controller.changeFilename(1L, "anyname.pdf"));

        verify(repository, times(1)).findById(1L);
        verify(repository, never()).save(any());
        verify(sftpService, never()).renameFile(any(), any());
    }


    @Test
    void integrityViolation_ReturnsParsedMessage() {
        ConstraintViolationException exception = mock(ConstraintViolationException.class);
        SQLException sqlEx = new SQLException("Unique constraint violation: material_title_key");
        when(exception.getSQLException()).thenReturn(sqlEx);
        when(exceptionHelper.getConstraintName("Unique constraint violation: material_title_key"))
                .thenReturn("material_title_key");

        String response = controller.integrityViolation(exception);

        assertEquals("Constraint violated: material_title_key", response);
    }

    @Test
    void materialNotFound_ReturnsMessage() {
        CourseMaterialNotFoundException e = new CourseMaterialNotFoundException(999L);

        String response = controller.materialNotFound(e);

        assertTrue(response.contains("999"));
    }
}
