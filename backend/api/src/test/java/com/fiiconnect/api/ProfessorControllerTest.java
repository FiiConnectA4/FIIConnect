package com.fiiconnect.api;

import com.fiiconnect.api.didactic.controllers.ProfessorController;
import com.fiiconnect.api.didactic.exceptions.ProfessorNotFoundException;
import com.fiiconnect.api.didactic.models.Professor;
import com.fiiconnect.api.didactic.repositories.ProfessorRepository;
import com.fiiconnect.api.didactic.services.ProfessorService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProfessorControllerTest {

    @Mock
    private ProfessorRepository repository;

    @Mock
    private ProfessorService service;

    @InjectMocks
    private ProfessorController controller;

    private Professor professor;

    @BeforeEach
    void setUp() {
        professor = new Professor(1L, "1234567890123", "John", "Doe", "Associate Professor");
    }

    @Test
    void all_ReturnsAllProfessors() {
        List<Professor> professors = List.of(professor);
        when(repository.findAll()).thenReturn(professors);

        List<Professor> result = controller.all();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(professor, result.get(0));
        verify(repository, times(1)).findAll();
    }

    @Test
    void one_ReturnsProfessor_WhenExists() {
        when(repository.findById(1L)).thenReturn(Optional.of(professor));

        Professor result = controller.one(1L);

        assertNotNull(result);
        assertEquals(professor, result);
        verify(repository, times(1)).findById(1L);
        verify(service, times(1)).attachCourses(professor);
    }

    @Test
    void one_ThrowsException_WhenNotFound() {
        when(repository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ProfessorNotFoundException.class, () -> controller.one(1L));
        verify(repository, times(1)).findById(1L);
        verify(service, never()).attachCourses(any());
    }
}


