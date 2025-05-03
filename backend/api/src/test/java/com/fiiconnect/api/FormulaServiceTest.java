package com.fiiconnect.api;

import com.fiiconnect.api.didactic.controllers.FormulaController;
import com.fiiconnect.api.didactic.helpers.SQLExceptionMessageParser;
import com.fiiconnect.api.didactic.models.Formula;
import com.fiiconnect.api.didactic.models.FormulaComponent;
import com.fiiconnect.api.didactic.services.FormulaService;
import org.hibernate.exception.ConstraintViolationException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;


import com.fiiconnect.api.didactic.exceptions.FormulaNotFoundException;
import com.fiiconnect.api.didactic.repositories.FormulaComponentRepository;
import com.fiiconnect.api.didactic.repositories.FormulaRepository;

import java.util.Optional;

/*
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
    void setUp() {
        formula = new Formula(1L, 10L, "F = ma");
        component = new FormulaComponent(1L, 1L, "F");
    }

    @Test
    void addFormula_SavesSuccessfully() {
        service.addFormula(formula);
        verify(formulaRepository, times(1)).save(formula);
    }

    @Test
    void deleteFormula_DeletesSuccessfully() {
        service.deleteFormula(1L);
        verify(formulaRepository, times(1)).deleteById(1L);
    }

    @Test
    void getFormula_ReturnsFormulaWithComponents() {
        when(formulaRepository.findById(1L)).thenReturn(Optional.of(formula));
        when(componentRepository.findAll()).thenReturn(List.of(component));

        Formula result = service.getFormula(1L);

        assertEquals("F = ma", result.getText());
        assertEquals(1, result.getComponents().size());
        assertEquals("F", result.getComponents().get(0).getName());
    }

    @Test
    void getFormula_ThrowsWhenNotFound() {
        when(formulaRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(FormulaNotFoundException.class, () -> service.getFormula(1L));
    }

    @Test
    void viewAllFormulas_ReturnsList() {
        when(formulaRepository.findAll()).thenReturn(List.of(formula));

        List<Formula> result = service.viewAllFormulas();

        assertEquals(1, result.size());
        assertEquals("F = ma", result.get(0).getText());
    }

    @Test
    void addFormulaComponent_SavesSuccessfully() {
        service.addFormulaComponent(component);
        verify(componentRepository, times(1)).save(component);
    }

    @Test
    void deleteFormulaComponent_DeletesSuccessfully() {
        service.deleteFormulaComponent(1L);
        verify(componentRepository, times(1)).deleteById(1L);
    }

    @Test
    void getFormulaComponent_ReturnsComponent() {
        when(componentRepository.findById(1L)).thenReturn(Optional.of(component));

        FormulaComponent result = service.getFormulaComponent(1L);
        assertEquals("F", result.getName());
    }

    @Test
    void getFormulaComponent_ThrowsWhenNotFound() {
        when(componentRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(FormulaNotFoundException.class, () -> service.getFormulaComponent(1L));
    }

    @Test
    void viewAllFormulaComponents_ReturnsList() {
        when(componentRepository.findAll()).thenReturn(List.of(component));

        List<FormulaComponent> result = service.viewAllFormulaComponents();

        assertEquals(1, result.size());
        assertEquals("F", result.get(0).getName());
    }
/*
    @Test
    void attachComponents_FiltersCorrectly() {
        FormulaComponent comp1 = new FormulaComponent(1L, 1L, "F");
        FormulaComponent comp2 = new FormulaComponent(2L, 2L, "a");
        when(componentRepository.findAll()).thenReturn(List.of(comp1, comp2));

        Formula inputFormula = new Formula(1L, 10L, "F = ma");
        service.attachComponents(inputFormula);

        assertEquals(1, inputFormula.getComponents().size());
        assertEquals("F", inputFormula.getComponents().get(0).getName());
    }*/


