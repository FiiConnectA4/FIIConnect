package com.fiiconnect.api.didactic.controllers;

import com.fiiconnect.api.didactic.exceptions.FormulaNotFoundException;
import com.fiiconnect.api.didactic.helpers.SQLExceptionMessageParser;
import com.fiiconnect.api.didactic.models.Formula;
import com.fiiconnect.api.didactic.models.FormulaComponent;
import com.fiiconnect.api.didactic.services.FormulaService;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@RestController
@RequestMapping("/didactic")
public class FormulaController {
    private final FormulaService service;
    private final SQLExceptionMessageParser exceptionHelper;

    public FormulaController(FormulaService service, SQLExceptionMessageParser exceptionHelper) {
        this.service = service;
        this.exceptionHelper = exceptionHelper;
    }

    @GetMapping("/formulas")
    public CollectionModel<EntityModel<Formula>> allFormulas() {
        List<Formula> formulas = service.viewAllFormulas();
        formulas.forEach(service::attachComponents);
        List<EntityModel<Formula>> formulaModels = formulas.stream()
                .map(formula -> EntityModel.of(formula,
                        linkTo(methodOn(FormulaController.class).oneFormula(formula.getId())).withSelfRel(),
                        linkTo(methodOn(FormulaController.class).allFormulas()).withRel("formulas")))
                .collect(Collectors.toList());
        return CollectionModel.of(formulaModels, linkTo(methodOn(FormulaController.class).allFormulas()).withSelfRel());
    }

    @GetMapping("/formula/{id}")
    public EntityModel<Formula> oneFormula(@PathVariable("id") Long id) {
        Formula formula = service.getFormula(id);
        return EntityModel.of(formula,
                linkTo(methodOn(FormulaController.class).oneFormula(id)).withSelfRel(),
                linkTo(methodOn(FormulaController.class).allFormulas()).withRel("formulas"));
    }

    @GetMapping("/course/{idCourse}/formula")
    public EntityModel<Formula> getFormulaByCourse(@PathVariable("idCourse") Long idCourse) {
        Formula formula = service.getFormulaByCourseId(idCourse);
        return EntityModel.of(formula,
                linkTo(methodOn(FormulaController.class).getFormulaByCourse(idCourse)).withSelfRel(),
                linkTo(methodOn(FormulaController.class).allFormulas()).withRel("formulas"));
    }

    @PostMapping("/formula")
    public ResponseEntity<?> newFormula(@RequestBody FormulaRequest request) {
        Formula newFormula = new Formula();
        newFormula.setIdCourse(request.getIdCourse());
        newFormula.setText(request.getText());

        // Parse components after "="
        List<FormulaComponent> components = parseFormulaComponents(request.getText(), newFormula);
        newFormula.setComponents(components);

        service.addFormula(newFormula);
        EntityModel<Formula> entityModel = EntityModel.of(newFormula,
                linkTo(methodOn(FormulaController.class).oneFormula(newFormula.getId())).withSelfRel(),
                linkTo(methodOn(FormulaController.class).allFormulas()).withRel("formulas"));
        return ResponseEntity.created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri()).body(entityModel);
    }

    @PutMapping("/formula/{id}")
    public ResponseEntity<?> replaceFormula(@PathVariable("id") Long id, @RequestBody Formula newFormula) {
        Formula updatedFormula = service.getFormula(id);
        updatedFormula.setIdCourse(newFormula.getIdCourse());
        updatedFormula.setText(newFormula.getText());
        service.addFormula(updatedFormula);
        EntityModel<Formula> entityModel = EntityModel.of(updatedFormula,
                linkTo(methodOn(FormulaController.class).oneFormula(id)).withSelfRel());
        return ResponseEntity.created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri()).body(entityModel);
    }

    @DeleteMapping("/formula/{id}")
    public ResponseEntity<?> deleteFormula(@PathVariable("id") Long id) {
        service.deleteFormula(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/formula-components")
    public CollectionModel<EntityModel<FormulaComponent>> allFormulaComponents() {
        List<FormulaComponent> components = service.viewAllFormulaComponents();
        List<EntityModel<FormulaComponent>> componentModels = components.stream()
                .map(component -> EntityModel.of(component,
                        linkTo(methodOn(FormulaController.class).oneFormulaComponent(component.getId())).withSelfRel(),
                        linkTo(methodOn(FormulaController.class).allFormulaComponents()).withRel("formula-components")))
                .collect(Collectors.toList());
        return CollectionModel.of(componentModels, linkTo(methodOn(FormulaController.class).allFormulaComponents()).withSelfRel());
    }

    @GetMapping("/formula-component/{id}")
    public EntityModel<FormulaComponent> oneFormulaComponent(@PathVariable("id") Long id) {
        FormulaComponent component = service.getFormulaComponent(id);
        return EntityModel.of(component,
                linkTo(methodOn(FormulaController.class).oneFormulaComponent(id)).withSelfRel(),
                linkTo(methodOn(FormulaController.class).allFormulaComponents()).withRel("formula-components"));
    }

    @PostMapping("/formula-component")
    public ResponseEntity<?> newFormulaComponent(@RequestBody FormulaComponent newComponent) {
        newComponent.setId(null); // Enforce DB-generated ID
        service.addFormulaComponent(newComponent);
        EntityModel<FormulaComponent> entityModel = EntityModel.of(newComponent,
                linkTo(methodOn(FormulaController.class).oneFormulaComponent(newComponent.getId())).withSelfRel());
        return ResponseEntity.created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri()).build();
    }

    @PutMapping("/formula-component/{id}")
    public ResponseEntity<?> replaceFormulaComponent(@PathVariable("id") Long id, @RequestBody FormulaComponent newComponent) {
        FormulaComponent updatedComponent = service.getFormulaComponent(id);
        updatedComponent.setFormula(newComponent.getFormula());
        updatedComponent.setName(newComponent.getName());
        service.addFormulaComponent(updatedComponent);
        EntityModel<FormulaComponent> entityModel = EntityModel.of(updatedComponent,
                linkTo(methodOn(FormulaController.class).oneFormulaComponent(id)).withSelfRel());
        return ResponseEntity.created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri()).body(entityModel);
    }

    @DeleteMapping("/formula-component/{id}")
    public ResponseEntity<?> deleteFormulaComponent(@PathVariable("id") Long id) {
        service.deleteFormulaComponent(id);
        return ResponseEntity.noContent().build();
    }

    @ResponseStatus(HttpStatus.CONFLICT)
    @ExceptionHandler(ConstraintViolationException.class)
    public String integrityViolation(ConstraintViolationException e) {
        SQLException sqlException = e.getSQLException();
        String message = sqlException.getMessage();
        message = exceptionHelper.getConstraintName(message);
        return "Constraint violated: " + message;
    }

    // DTO for POST request
    public static class FormulaRequest {
        private Long idCourse;
        private String text;

        public Long getIdCourse() {
            return idCourse;
        }

        public void setIdCourse(Long idCourse) {
            this.idCourse = idCourse;
        }

        public String getText() {
            return text;
        }

        public void setText(String text) {
            this.text = text;
        }
    }

    private List<FormulaComponent> parseFormulaComponents(String formulaText, Formula formula) {
        List<FormulaComponent> components = new ArrayList<>();
        // Split formula at "=" and take the part after it
        String[] parts = formulaText.split("=", 2);
        if (parts.length < 2) {
            return components; // No components if no "=" found
        }
        String expression = parts[1].trim();

        // Regex to match variable names (alphanumeric with spaces or underscores)
        Pattern pattern = Pattern.compile("\\b[a-zA-Z][a-zA-Z0-9_ ]*\\b");
        Matcher matcher = pattern.matcher(expression);

        while (matcher.find()) {
            String componentName = matcher.group().replace(" ", "_"); // Convert spaces to underscores
            // Skip common keywords
            if (!componentName.equals("Final_grade")) { // Adjust for other keywords if needed
                FormulaComponent component = new FormulaComponent();
                component.setFormula(formula);
                component.setName(componentName);
                components.add(component);
            }
        }
        return components;
    }
}