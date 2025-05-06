package com.fiiconnect.api;

import com.fiiconnect.api.didactic.models.Formula;
import com.fiiconnect.api.didactic.models.FormulaComponent;
import com.fiiconnect.api.didactic.services.FormulaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


import com.fiiconnect.api.didactic.exceptions.FormulaNotFoundException;
import com.fiiconnect.api.didactic.repositories.FormulaComponentRepository;
import com.fiiconnect.api.didactic.repositories.FormulaRepository;

import java.util.Optional;

import org.mockito.InjectMocks;
import org.mockito.Mock;

import java.util.ArrayList;

@ExtendWith(MockitoExtension.class)
public class FormulaServiceTest {

    @Mock
    private FormulaRepository formulaRepository;

    @Mock
    private FormulaComponentRepository componentRepository;

    @InjectMocks
    private FormulaService service;

    private Formula formula;
    private FormulaComponent component;

    @BeforeEach
    void setup() {
        formula = new Formula();
        formula.setId(1L);
        formula.setIdCourse(100L);
        formula.setText("A + B");
        formula.setComponents(new ArrayList<>()); // Initialize components list

        component = new FormulaComponent();
        component.setId(10L);
        component.setIdFormula(1L);
        component.setName("A");
    }

    @Test
    void testAddFormula() {
        service.addFormula(formula);

        verify(formulaRepository).save(formula);
    }

    @Test
    void testDeleteFormula() {
        service.deleteFormula(1L);

        verify(formulaRepository).deleteById(1L);
    }

    @Test
    void testGetFormula_Success() {
        when(formulaRepository.findById(1L)).thenReturn(Optional.of(formula));
        when(componentRepository.findByIdFormula(1L)).thenReturn(List.of(component));

        Formula result = service.getFormula(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
        assertEquals(1, result.getComponents().size());
        assertEquals("A", result.getComponents().get(0).getName());
        verify(formulaRepository).findById(1L);
        verify(componentRepository).findByIdFormula(1L);
    }

    @Test
    void testGetFormula_NotFound() {
        when(formulaRepository.findById(1L)).thenReturn(Optional.empty());

        FormulaNotFoundException exception = assertThrows(FormulaNotFoundException.class, () -> {
            service.getFormula(1L);
        });

        assertEquals("Formula not found with ID: 1", exception.getMessage()); // Updated expected message
        verify(formulaRepository).findById(1L);
        verifyNoInteractions(componentRepository);
    }

    @Test
    void testGetFormulaByCourseId_Success() {
        when(formulaRepository.findByIdCourse(100L)).thenReturn(Optional.of(formula));
        when(componentRepository.findByIdFormula(1L)).thenReturn(List.of(component));

        Formula result = service.getFormulaByCourseId(100L);

        assertNotNull(result);
        assertEquals(100L, result.getIdCourse());
        assertEquals(1, result.getComponents().size());
        verify(formulaRepository).findByIdCourse(100L);
        verify(componentRepository).findByIdFormula(1L);
    }

    @Test
    void testGetFormulaByCourseId_NotFound() {
        when(formulaRepository.findByIdCourse(100L)).thenReturn(Optional.empty());

        FormulaNotFoundException exception = assertThrows(FormulaNotFoundException.class, () -> {
            service.getFormulaByCourseId(100L);
        });

        assertEquals("No formula found for course ID: 100", exception.getMessage());
        verify(formulaRepository).findByIdCourse(100L);
        verifyNoInteractions(componentRepository);
    }

    @Test
    void testViewAllFormulas() {
        when(formulaRepository.findAll()).thenReturn(List.of(formula));

        List<Formula> result = service.viewAllFormulas();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getId());
        verify(formulaRepository).findAll();
    }

    @Test
    void testAddFormulaComponent() {
        service.addFormulaComponent(component);

        verify(componentRepository).save(component);
    }

    @Test
    void testDeleteFormulaComponent() {
        service.deleteFormulaComponent(10L);

        verify(componentRepository).deleteById(10L);
    }

    @Test
    void testGetFormulaComponent_Success() {
        when(componentRepository.findById(10L)).thenReturn(Optional.of(component));

        FormulaComponent result = service.getFormulaComponent(10L);

        assertNotNull(result);
        assertEquals(10L, result.getId());
        assertEquals("A", result.getName());
        verify(componentRepository).findById(10L);
    }

    @Test
    void testGetFormulaComponent_NotFound() {
        when(componentRepository.findById(10L)).thenReturn(Optional.empty());

        FormulaNotFoundException exception = assertThrows(FormulaNotFoundException.class, () -> {
            service.getFormulaComponent(10L);
        });

        assertEquals("Formula not found with ID: 10", exception.getMessage());
        verify(componentRepository).findById(10L);
    }

    @Test
    void testViewAllFormulaComponents() {
        when(componentRepository.findAll()).thenReturn(List.of(component));

        List<FormulaComponent> result = service.viewAllFormulaComponents();

        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(10L, result.get(0).getId());
        verify(componentRepository).findAll();
    }

    @Test
    void testAttachComponents() {
        when(componentRepository.findByIdFormula(1L)).thenReturn(List.of(component));

        service.attachComponents(formula);

        assertEquals(1, formula.getComponents().size());
        assertEquals("A", formula.getComponents().get(0).getName());
        verify(componentRepository).findByIdFormula(1L);
    }
}