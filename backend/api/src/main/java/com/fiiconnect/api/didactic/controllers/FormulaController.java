package com.fiiconnect.api.didactic.controllers;

import com.fiiconnect.api.didactic.exceptions.*;
import com.fiiconnect.api.didactic.helpers.SQLExceptionMessageParser;
import com.fiiconnect.api.didactic.helpers.formula.FormulaParser;
import com.fiiconnect.api.didactic.models.*;
import com.fiiconnect.api.didactic.services.EnrollmentService;
import com.fiiconnect.api.didactic.services.FormulaService;
import org.hibernate.exception.ConstraintViolationException;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.IanaLinkRelations;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.time.Instant;
import java.util.*;
import java.util.logging.Logger;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.*;

@RestController
@RequestMapping("/didactic")
public class FormulaController {
    private static final Logger LOGGER = Logger.getLogger(FormulaController.class.getName());

    private final FormulaService service;
    private final EnrollmentService enrollmentService;
    private final SQLExceptionMessageParser exceptionHelper;

    public FormulaController(FormulaService service, EnrollmentService enrollmentService, SQLExceptionMessageParser exceptionHelper) {
        this.service = service;
        this.enrollmentService = enrollmentService;
        this.exceptionHelper = exceptionHelper;
    }

    @GetMapping("/formulas")
    public CollectionModel<EntityModel<Formula>> allFormulas() {
        LOGGER.info("Fetching all formulas");
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
        LOGGER.info("Fetching formula with ID: " + id);
        Formula formula = service.getFormula(id);
        return EntityModel.of(formula,
                linkTo(methodOn(FormulaController.class).oneFormula(id)).withSelfRel(),
                linkTo(methodOn(FormulaController.class).allFormulas()).withRel("formulas"));
    }

    @GetMapping("/formula/{id}/evaluate")
    public Grade evaluateFormulaForStudent(@PathVariable("id") Long id, @RequestParam Long idStud) {
        LOGGER.info("Fetching formula with ID: " + id);
        Formula formula = service.getFormula(id);
        FormulaParser.createSyntaxTree(formula);
        Double result = service.evaluateFormula(formula, idStud);
        Grade newGrade = new Grade(new GradeCompositeKey(idStud, formula.getIdCourse()), result, Date.from(Instant.now()));
        return newGrade;
    }

    @GetMapping("/formula/{id}/evaluate/all")
    public List<Grade> evaluateFormulaForAllStudents(@PathVariable("id") Long id)
    {
        Formula formula = service.getFormula(id);
        FormulaParser.createSyntaxTree(formula);
        Long idCourse = formula.getIdCourse();
        List<Enrollment> enrolled = enrollmentService.getCourseEnrollments(idCourse);
        List<Grade> out = new ArrayList<>();
        for(Enrollment enrollment : enrolled)
        {
            Long idStud = enrollment.getId().getIdStud();
            Double result = service.evaluateFormula(formula, idStud);
            Grade newGrade = new Grade(new GradeCompositeKey(idStud, idCourse), result, Date.from(Instant.now()));
            out.add(newGrade);
        }
        return out;
    }

    @GetMapping("/course/{idCourse}/formula")
    public EntityModel<Formula> getFormulaByCourse(@PathVariable("idCourse") Long idCourse) {
        LOGGER.info("Fetching formula for course ID: " + idCourse);
        Formula formula = service.getFormulaByCourseId(idCourse);
        return EntityModel.of(formula,
                linkTo(methodOn(FormulaController.class).getFormulaByCourse(idCourse)).withSelfRel(),
                linkTo(methodOn(FormulaController.class).allFormulas()).withRel("formulas"));
    }

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @PostMapping("/formula")
    public ResponseEntity<?> newFormula(@RequestBody Formula request) {
        LOGGER.info("Creating new formula for course ID: " + request.getIdCourse());
        Formula newFormula = new Formula();
        newFormula.setIdCourse(request.getIdCourse());
        newFormula.setText(request.getText());

        List<FormulaComponent> components = parseFormulaComponents(request.getText(), newFormula);
        newFormula.setComponents(components);

        try {
            service.addFormula(newFormula);
        } catch (Exception e) {
            LOGGER.severe("Failed to save formula: " + e.getMessage());
            throw e;
        }

        EntityModel<Formula> entityModel = EntityModel.of(newFormula,
                linkTo(methodOn(FormulaController.class).oneFormula(newFormula.getId())).withSelfRel(),
                linkTo(methodOn(FormulaController.class).allFormulas()).withRel("formulas"));
        return ResponseEntity.created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri()).body(entityModel);
    }

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @PutMapping("/formula/{id}")
    public ResponseEntity<?> replaceFormula(@PathVariable("id") Long id, @RequestBody Formula request) {
        LOGGER.info("Updating formula with ID: " + id);
        Formula updatedFormula = service.getFormula(id);
        updatedFormula.setIdCourse(request.getIdCourse());
        updatedFormula.setText(request.getText());

        FormulaParser.createSyntaxTree(updatedFormula);

        // Update components in place to preserve Hibernate's collection reference
        List<FormulaComponent> currentComponents = updatedFormula.getComponents();
        currentComponents.clear();
        service.addFormula(updatedFormula);
        // Remove existing components (orphanRemoval will delete them)
        List<FormulaComponent> newComponents = parseFormulaComponents(request.getText(), updatedFormula);
        currentComponents.addAll(newComponents);// Add new components to the same collection

        try {
            service.addFormula(updatedFormula);
        } catch (Exception e) {
            LOGGER.severe("Failed to update formula: " + e.getMessage());
            throw e;
        }

        EntityModel<Formula> entityModel = EntityModel.of(updatedFormula,
                linkTo(methodOn(FormulaController.class).oneFormula(id)).withSelfRel());
        return ResponseEntity.created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri()).body(entityModel);
    }

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @DeleteMapping("/formula/{id}")
    public ResponseEntity<?> deleteFormula(@PathVariable("id") Long id) {
        LOGGER.info("Deleting formula with ID: " + id);
        service.deleteFormula(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/formula-components")
    public CollectionModel<EntityModel<FormulaComponent>> allFormulaComponents() {
        LOGGER.info("Fetching all formula components");
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
        LOGGER.info("Fetching formula component with ID: " + id);
        FormulaComponent component = service.getFormulaComponent(id);
        return EntityModel.of(component,
                linkTo(methodOn(FormulaController.class).oneFormulaComponent(id)).withSelfRel(),
                linkTo(methodOn(FormulaController.class).allFormulaComponents()).withRel("formulas-components"));
    }

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @PostMapping("/formula-component")
    public ResponseEntity<?> newFormulaComponent(@RequestBody FormulaComponent newComponent) {
        LOGGER.info("Creating new formula component");
        newComponent.setId(null); // Enforce DB-generated ID
        service.addFormulaComponent(newComponent);
        EntityModel<FormulaComponent> entityModel = EntityModel.of(newComponent,
                linkTo(methodOn(FormulaController.class).oneFormulaComponent(newComponent.getId())).withSelfRel());
        return ResponseEntity.created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri()).build();
    }

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @PutMapping("/formula-component/{id}")
    public ResponseEntity<?> replaceFormulaComponent(@PathVariable("id") Long id, @RequestBody FormulaComponent newComponent) {
        LOGGER.info("Updating formula component with ID: " + id);
        FormulaComponent updatedComponent = service.getFormulaComponent(id);
        updatedComponent.setIdFormula(newComponent.getIdFormula());
        updatedComponent.setName(newComponent.getName());
        service.addFormulaComponent(updatedComponent);
        EntityModel<FormulaComponent> entityModel = EntityModel.of(updatedComponent,
                linkTo(methodOn(FormulaController.class).oneFormulaComponent(id)).withSelfRel());
        return ResponseEntity.created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri()).body(entityModel);
    }

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @DeleteMapping("/formula-component/{id}")
    public ResponseEntity<?> deleteFormulaComponent(@PathVariable("id") Long id) {
        LOGGER.info("Deleting formula component with ID: " + id);
        service.deleteFormulaComponent(id);
        return ResponseEntity.noContent().build();
    }

    @ResponseStatus(HttpStatus.CONFLICT)
    @ExceptionHandler(ConstraintViolationException.class)
    public String integrityViolation(ConstraintViolationException e) {
        SQLException sqlException = e.getSQLException();
        String message = sqlException.getMessage();
        message = exceptionHelper.getConstraintName(message);
        LOGGER.warning("Constraint violation: " + message);
        return "Constraint violated: " + message;
    }

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
        LOGGER.info("Parsing components for formula text: " + formulaText);
        List<FormulaComponent> components = new ArrayList<>();
        String[] parts = formulaText.split("=", 2);
        if (parts.length < 2) {
            LOGGER.warning("Invalid formula format: no '=' found");
            return components;
        }
        String expression = parts[1].trim();
        Pattern pattern = Pattern.compile("\\b[a-zA-Z][a-zA-Z0-9_ ]*\\b");
        Matcher matcher = pattern.matcher(expression);

        Set<String> foundComponents = new HashSet<>();
        while (matcher.find()) {
            String componentName = matcher.group().replace(" ", "_");
            if (!foundComponents.contains(componentName) && !componentName.equals("Final_grade") && !FormulaParser.functions.contains(componentName)) {
                FormulaComponent component = new FormulaComponent();
                component.setIdFormula(formula.getId());
                component.setName(componentName);
                components.add(component);
                foundComponents.add(componentName);
                LOGGER.info("Parsed component: " + componentName);
            }
        }
        return components;
    }

    @GetMapping("/component-score")
    public ComponentScore getScore(@RequestParam Long idStud, @RequestParam Long idComponent)
    {
        return service.getComponentScore(new ComponentScoreCompositeKey(idStud, idComponent));
    }

    @GetMapping("/component-score/all/by-component")
    public List<ComponentScore> getScoresByComponent(@RequestParam Long idComponent)
    {
        return service.getComponentScoresByIdComponent(idComponent);
    }

    @GetMapping("/component-score/all/by-student")
    public List<ComponentScore> getScoresByStudent(@RequestParam Long idStud)
    {
        return service.getComponentScoresByIdStud(idStud);
    }

    @PostMapping("/component-score")
    public void addScore(@RequestBody ComponentScore score)
    {
        service.addComponentScore(score);
    }

    @PutMapping("/component-score")
    public void modifyScore(@RequestBody ComponentScore score)
    {
        ComponentScore existingScore = service.getComponentScore(score.getId());
        existingScore.setValue(score.getValue());
        service.addComponentScore(existingScore);
    }

    @DeleteMapping("/component-score")
    public void deleteScore(@RequestParam Long idStud, @RequestParam Long idComponent)
    {
        ComponentScore score = service.getComponentScore(new ComponentScoreCompositeKey(idStud, idComponent));
        service.deleteComponentScore(score);
    }

    @DeleteMapping("/component-score/all/by-component")
    public void deleteAllScoresByComponent(@RequestParam Long idComponent)
    {
        List<ComponentScore> scores = service.getComponentScoresByIdComponent(idComponent);

        scores.forEach(service::deleteComponentScore);
    }

    @DeleteMapping("/component-score/all/by-student")
    public void deleteAllScoresByStudent(@RequestParam Long idStud)
    {
        List<ComponentScore> scores = service.getComponentScoresByIdStud(idStud);

        scores.forEach(service::deleteComponentScore);
    }

    @ExceptionHandler(FormulaNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String formulaNotFound(FormulaNotFoundException e) {
        return e.getMessage();
    }

    @ExceptionHandler(FormulaEvaluateException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public String formulaEvaluateError(FormulaEvaluateException e) {
        return e.getMessage();
    }

    @ExceptionHandler(FormulaParseException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public String formulaParseError(FormulaParseException e) {
        return e.getMessage();
    }

    @ExceptionHandler(ComponentNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String componentNotFound(ComponentNotFoundException e) {
        return e.getMessage();
    }

    @ExceptionHandler(ComponentScoreNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public String scoreNotFound(ComponentScoreNotFoundException e) {
        return e.getMessage();
    }
}