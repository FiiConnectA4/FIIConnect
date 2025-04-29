package com.fiiconnect.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fiiconnect.api.didactic.controllers.CourseMaterialController;
import com.fiiconnect.api.didactic.helpers.SQLExceptionMessageParser;
import com.fiiconnect.api.didactic.models.CourseMaterial;
import com.fiiconnect.api.didactic.repositories.CourseMaterialRepository;
import org.hibernate.exception.ConstraintViolationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.sql.SQLException;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class CourseMaterialControllerTest {

    @Mock
    private CourseMaterialRepository repository;

    @Mock
    private SQLExceptionMessageParser exceptionHelper;

    @InjectMocks
    private CourseMaterialController controller;

    private MockMvc mockMvc;

    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(controller).build();
        objectMapper = new ObjectMapper();
    }

    @Test
    void testGetAllMaterials() throws Exception {
        CourseMaterial cm1 = new CourseMaterial(1L, 100L, 200L, "example1.pdf", new Date(), new Date());
        CourseMaterial cm2 = new CourseMaterial(2L, 101L, 201L, "example2.pdf", new Date(), new Date());
        List<CourseMaterial> materials = Arrays.asList(cm1, cm2);

        when(repository.findAll()).thenReturn(materials);

        mockMvc.perform(get("/didactic/course/material")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].filename").value("example1.pdf"))
                .andExpect(jsonPath("$[1].id").value(2L))
                .andExpect(jsonPath("$[1].filename").value("example2.pdf"));

        verify(repository, times(1)).findAll();
    }

    @Test
    void testGetMaterialById_Found() throws Exception {
        CourseMaterial cm = new CourseMaterial(1L, 100L, 200L, "example.pdf", new Date(), new Date());

        when(repository.findById(1L)).thenReturn(Optional.of(cm));

        mockMvc.perform(get("/didactic/course/material/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.filename").value("example.pdf"));

        verify(repository, times(1)).findById(1L);
    }

    @Test
    void testGetMaterialById_NotFound() throws Exception {
        when(repository.findById(99L)).thenReturn(Optional.empty());

        mockMvc.perform(get("/didactic/course/material/99")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound())
                .andExpect(content().string("Could not find course material with id 99"));

        verify(repository, times(1)).findById(99L);
    }

    @Test
    void testUploadMaterial_Success() throws Exception {
        CourseMaterial input = new CourseMaterial(null, 100L, 200L, "lecture1.pdf", null, null);
        CourseMaterial saved = new CourseMaterial(5L, 100L, 200L, "lecture1.pdf", new Date(), new Date());

        when(repository.save(any(CourseMaterial.class))).thenReturn(saved);

        mockMvc.perform(post("/didactic/course/material")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isCreated())
                .andExpect(header().string("Location", "/didactic/course/material/5"));

        verify(repository, times(1)).save(any(CourseMaterial.class));
    }

    @Test
    void testUploadMaterial_ConstraintViolation() throws Exception {
        // Arrange
        CourseMaterial input = new CourseMaterial(null, 100L, 200L, "lecture1.pdf", null, null);
        SQLException sqlException = new SQLException("Constraint violation");
        ConstraintViolationException exception = new ConstraintViolationException("Constraint violation", sqlException, "unique_filename");

        when(repository.save(any(CourseMaterial.class))).thenThrow(exception);
        when(exceptionHelper.getConstraintName(sqlException.getMessage())).thenReturn("unique_filename");

        // Act & Assert
        mockMvc.perform(post("/didactic/course/material")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isConflict())
                .andExpect(content().string("Constraint violated: unique_filename"));

        verify(repository, times(1)).save(any(CourseMaterial.class));
        verify(exceptionHelper, times(1)).getConstraintName(sqlException.getMessage());
    }

    @Test
    void testDeleteMaterial() throws Exception {
        doNothing().when(repository).deleteById(1L);

        mockMvc.perform(delete("/didactic/course/material/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());

        verify(repository, times(1)).deleteById(1L);
    }
}