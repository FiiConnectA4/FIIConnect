package com.fiiconnect.api;
import com.fiiconnect.api.didactic.controllers.ProfessorController;
import com.fiiconnect.api.didactic.models.Professor;
import com.fiiconnect.api.didactic.repositories.ProfessorRepository;
import com.fiiconnect.api.didactic.services.ProfessorService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
public class ProfessorControllerTest {

    @Mock
    private ProfessorRepository professorRepository;

    @Mock
    private ProfessorService professorService;

    @InjectMocks
    private ProfessorController professorController;

    private MockMvc mockMvc;

    @Test
    void testGetAllProfessors() throws Exception {
        Professor professor1 = new Professor(1L, "1234567890123", "John", "Doe", "Professor");
        Professor professor2 = new Professor(2L, "9876543210987", "Jane", "Smith", "Associate Professor");
        List<Professor> professors = Arrays.asList(professor1, professor2);

        when(professorRepository.findAll()).thenReturn(professors);

        mockMvc = MockMvcBuilders.standaloneSetup(professorController).build();

        mockMvc.perform(get("/didactic/professor")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].firstName").value("John"))
                .andExpect(jsonPath("$[0].lastName").value("Doe"))
                .andExpect(jsonPath("$[1].id").value(2L))
                .andExpect(jsonPath("$[1].firstName").value("Jane"))
                .andExpect(jsonPath("$[1].lastName").value("Smith"));

        verify(professorRepository, times(1)).findAll();
    }

    @Test
    void testGetProfessorById_Success() throws Exception {
        Long professorId = 1L;
        Professor professor = new Professor(professorId, "1234567890123", "John", "Doe", "Professor");

        when(professorRepository.findById(professorId)).thenReturn(Optional.of(professor));
        doNothing().when(professorService).attachCourses(professor);

        mockMvc = MockMvcBuilders.standaloneSetup(professorController).build();

        mockMvc.perform(get("/didactic/professor/{id}", professorId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(professorId))
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Doe"))
                .andExpect(jsonPath("$.rank").value("Professor"));

        verify(professorRepository, times(1)).findById(professorId);
        verify(professorService, times(1)).attachCourses(professor);
    }

    @Test
    void testGetProfessorById_NotFound() throws Exception {
        Long professorId = 1L;

        when(professorRepository.findById(anyLong())).thenReturn(Optional.empty());

        mockMvc = MockMvcBuilders.standaloneSetup(professorController).build();

        mockMvc.perform(get("/didactic/professor/{id}", professorId)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        verify(professorRepository, times(1)).findById(professorId);
        verify(professorService, never()).attachCourses(any());
    }
}
