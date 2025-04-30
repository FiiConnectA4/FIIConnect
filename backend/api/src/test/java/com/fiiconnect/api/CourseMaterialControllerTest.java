package com.fiiconnect.api;

import com.fiiconnect.api.didactic.controllers.CourseMaterialController;
import com.fiiconnect.api.didactic.exceptions.CourseMaterialNotFoundException;
import com.fiiconnect.api.didactic.helpers.SQLExceptionMessageParser;
import com.fiiconnect.api.didactic.models.CourseMaterial;
import com.fiiconnect.api.didactic.repositories.CourseMaterialRepository;
import org.hibernate.exception.ConstraintViolationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

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

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class CourseMaterialControllerTest {

    @Mock
    private CourseMaterialRepository repository;

    @Mock
    private SQLExceptionMessageParser exceptionHelper;

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
    void uploadMaterial_SavesMaterialAndReturns201() {
        CourseMaterial input = new CourseMaterial();
        input.setIdCourse(101L);
        input.setIdProfessor(201L);
        input.setFilename("lab1.pdf");
        input.setUploadDate(new Date());
        input.setUpdateDate(new Date());

        CourseMaterial saved = new CourseMaterial();
        saved.setId(2L);
        saved.setIdCourse(input.getIdCourse());
        saved.setIdProfessor(input.getIdProfessor());
        saved.setFilename(input.getFilename());
        saved.setUploadDate(input.getUploadDate());
        saved.setUpdateDate(input.getUpdateDate());

        when(repository.save(any(CourseMaterial.class))).thenReturn(saved);

        ResponseEntity<?> response = controller.uploadMaterial(input);

        assertEquals(201, response.getStatusCode().value());
        assertEquals("/didactic/course/material/2", response.getHeaders().getLocation().toString());
        verify(repository, times(1)).save(any());
    }

    @Test
    void deleteMaterial_DeletesSuccessfully() {
        doNothing().when(repository).deleteById(1L);

        controller.deleteMaterial(1L);

        verify(repository, times(1)).deleteById(1L);
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

