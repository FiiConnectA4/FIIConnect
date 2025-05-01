package com.fiiconnect.api;

import com.fiiconnect.api.didactic.controllers.FormulaController;
import com.fiiconnect.api.didactic.helpers.SQLExceptionMessageParser;
import com.fiiconnect.api.didactic.models.Formula;
import com.fiiconnect.api.didactic.models.FormulaComponent;
import com.fiiconnect.api.didactic.services.FormulaService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import org.mockito.*;
import org.springframework.http.ResponseEntity;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.CollectionModel;

@ExtendWith(MockitoExtension.class)
public class FormulaControllerTest {

    @Mock
    private FormulaService service;

    @Mock
    private SQLExceptionMessageParser exceptionHelper;

    @InjectMocks
    private FormulaController controller;

    private Formula formula;
    private FormulaComponent component;

    @BeforeEach
    void setup() {
        formula = new Formula();
        formula.setId(1L);
        formula.setIdCourse(100L);
        formula.setText("A + B");

        component = new FormulaComponent();
        component.setId(10L);
        component.setIdFormula(1L);
        component.setName("A");
    }

    @Test
    void testAllFormulas() {
        when(service.viewAllFormulas()).thenReturn(List.of(formula));
        doNothing().when(service).attachComponents(formula);

        CollectionModel<EntityModel<Formula>> response = controller.allFormulas();

        assertNotNull(response);
        verify(service, times(1)).viewAllFormulas();
        verify(service, times(1)).attachComponents(formula);
    }

    @Test
    void testOneFormula() {
        when(service.getFormula(1L)).thenReturn(formula);

        EntityModel<Formula> response = controller.oneFormula(1L);

        assertNotNull(response);
        assertEquals(formula.getId(), response.getContent().getId());
        verify(service).getFormula(1L);
    }

    @Test
    void testNewFormula() {
        Formula newFormula = new Formula();
        newFormula.setText("C + D");
        newFormula.setIdCourse(101L);

        ResponseEntity<?> response = controller.newFormula(newFormula);

        assertEquals(201, response.getStatusCodeValue());
        verify(service).addFormula(newFormula);
    }

    @Test
    void testReplaceFormula() {
        when(service.getFormula(1L)).thenReturn(formula);

        Formula updated = new Formula();
        updated.setIdCourse(200L);
        updated.setText("X + Y");

        ResponseEntity<?> response = controller.replaceFormula(1L, updated);

        assertEquals(201, response.getStatusCodeValue());
        verify(service).addFormula(any(Formula.class));
    }

    @Test
    void testDeleteFormula() {
        doNothing().when(service).deleteFormula(1L);

        ResponseEntity<?> response = controller.deleteFormula(1L);

        assertEquals(204, response.getStatusCodeValue());
        verify(service).deleteFormula(1L);
    }

    @Test
    void testAllFormulaComponents() {
        when(service.viewAllFormulaComponents()).thenReturn(List.of(component));

        CollectionModel<EntityModel<FormulaComponent>> response = controller.allFormulaComponents();

        assertNotNull(response);
        verify(service).viewAllFormulaComponents();
    }

    @Test
    void testOneFormulaComponent() {
        when(service.getFormulaComponent(10L)).thenReturn(component);

        EntityModel<FormulaComponent> response = controller.oneFormulaComponent(10L);

        assertNotNull(response);
        assertEquals(component.getId(), response.getContent().getId());
        verify(service).getFormulaComponent(10L);
    }

    @Test
    void testNewFormulaComponent() {
        FormulaComponent newComponent = new FormulaComponent();
        newComponent.setName("Z");
        newComponent.setIdFormula(1L);

        ResponseEntity<?> response = controller.newFormulaComponent(newComponent);

        assertEquals(201, response.getStatusCodeValue());
        verify(service).addFormulaComponent(newComponent);
    }

    @Test
    void testReplaceFormulaComponent() {
        when(service.getFormulaComponent(10L)).thenReturn(component);

        FormulaComponent updated = new FormulaComponent();
        updated.setIdFormula(2L);
        updated.setName("Y");

        ResponseEntity<?> response = controller.replaceFormulaComponent(10L, updated);

        assertEquals(201, response.getStatusCodeValue());
        verify(service).addFormulaComponent(any(FormulaComponent.class));
    }

    @Test
    void testDeleteFormulaComponent() {
        doNothing().when(service).deleteFormulaComponent(10L);

        ResponseEntity<?> response = controller.deleteFormulaComponent(10L);

        assertEquals(204, response.getStatusCodeValue());
        verify(service).deleteFormulaComponent(10L);
    }
}


