package com.fiiconnect.api.didactic.controllers;

import com.fiiconnect.api.auth_userMgmt.controllers.PersonController;
import com.fiiconnect.api.auth_userMgmt.dtos.PersonInfoDTO;
import com.fiiconnect.api.didactic.exceptions.*;
import com.fiiconnect.api.didactic.helpers.SQLExceptionMessageParser;
import com.fiiconnect.api.didactic.helpers.formula.FormulaParser;
import com.fiiconnect.api.didactic.models.*;
import com.fiiconnect.api.didactic.repositories.FormulaComponentRepository;
import com.fiiconnect.api.didactic.repositories.FormulaRepository;
import com.fiiconnect.api.didactic.services.CourseService;
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
    private final FormulaRepository repository;
    private final FormulaComponentRepository componentRepository;
    private final EnrollmentService enrollmentService;
    private final SQLExceptionMessageParser exceptionHelper;
    private final CourseService courseService;
    private final PersonController personController;

    public FormulaController(FormulaService service, FormulaRepository repository, FormulaComponentRepository componentRepository, EnrollmentService enrollmentService, SQLExceptionMessageParser exceptionHelper, CourseService courseService, PersonController personController) {
        this.service = service;
        this.repository = repository;
        this.componentRepository = componentRepository;
        this.enrollmentService = enrollmentService;
        this.exceptionHelper = exceptionHelper;
        this.courseService = courseService;
        this.personController = personController;
    }

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @GetMapping("/formulas")
    public CollectionModel<EntityModel<Formula>> allFormulas() {
        LOGGER.info("Fetching all formulas");
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();

        List<Formula> formulas = service.viewAllFormulas().stream().filter(f -> courseService.allowCourseViewing(person, f.getIdCourse())).toList();
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
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();

        Formula formula = service.getFormula(id);
        if(!courseService.allowCourseViewing(person, formula.getIdCourse()))
            throw new UnauthorizedOperationException("Only students enrolled in the formula's course or professors who teach the course may see its formula");

        return EntityModel.of(formula,
                linkTo(methodOn(FormulaController.class).oneFormula(id)).withSelfRel(),
                linkTo(methodOn(FormulaController.class).allFormulas()).withRel("formulas"));
    }

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @GetMapping("/formula/{id}/evaluate")
    public Grade evaluateFormulaForStudent(@PathVariable("id") Long id, @RequestParam Long idStud) {
        LOGGER.info("Fetching formula with ID: " + id);
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        Formula formula = service.getFormula(id);
        if(!courseService.authorizeCourseOperation(person, formula.getIdCourse(), true))
            throw new UnauthorizedOperationException("Only professors who teach the course may evaluate its formula");

        FormulaParser.createSyntaxTree(formula);
        Double result = service.evaluateFormula(formula, idStud);
        Grade newGrade = new Grade(new GradeCompositeKey(idStud, formula.getIdCourse()), result, Date.from(Instant.now()));
        return newGrade;
    }

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @GetMapping("/formula/{id}/evaluate/all")
    public List<Grade> evaluateFormulaForAllStudents(@PathVariable("id") Long id)
    {
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        Formula formula = service.getFormula(id);
        if(!courseService.authorizeCourseOperation(person, formula.getIdCourse(), true))
            throw new UnauthorizedOperationException("Only professors who teach the course may evaluate its formula");

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
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!courseService.allowCourseViewing(person, idCourse))
            throw new UnauthorizedOperationException("Only students enrolled in the formula's course or professors who teach the course may see its formula");

        Formula formula = service.getFormulaByCourseId(idCourse);
        return EntityModel.of(formula,
                linkTo(methodOn(FormulaController.class).getFormulaByCourse(idCourse)).withSelfRel(),
                linkTo(methodOn(FormulaController.class).allFormulas()).withRel("formulas"));
    }

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @PostMapping("/formula")
    public ResponseEntity<?> newFormula(@RequestBody Formula request) {
        LOGGER.info("Creating new formula for course ID: " + request.getIdCourse());
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!courseService.authorizeCourseOperation(person, request.getIdCourse(), true))
            throw new UnauthorizedOperationException("Only professors who teach the course may create its formula");

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
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!courseService.authorizeCourseOperation(person, request.getIdCourse(), true)) //original course
            throw new UnauthorizedOperationException("Only professors who teach the course may change its formula");
        if(!request.getIdCourse().equals(updatedFormula.getIdCourse()) && !courseService.authorizeCourseOperation(person, updatedFormula.getIdCourse(), true)) //possibly different course
            throw new UnauthorizedOperationException("Only professors who teach the course may change its formula");

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
        Formula formula = service.getFormula(id);
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!courseService.authorizeCourseOperation(person, formula.getIdCourse(), true))
            throw new UnauthorizedOperationException("Only professors who teach the course may delete its formula");

        service.deleteFormula(id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @GetMapping("/formula-components")
    public CollectionModel<EntityModel<FormulaComponent>> allFormulaComponents() {
        LOGGER.info("Fetching all formula components");
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        List<FormulaComponent> components = service.viewAllFormulaComponents().stream().filter(c -> courseService.allowCourseViewing(person, repository.findCourseId(c.getIdFormula()))).toList();

        List<EntityModel<FormulaComponent>> componentModels = components.stream()
                .map(component -> EntityModel.of(component,
                        linkTo(methodOn(FormulaController.class).oneFormulaComponent(component.getId())).withSelfRel(),
                        linkTo(methodOn(FormulaController.class).allFormulaComponents()).withRel("formula-components")))
                .collect(Collectors.toList());
        return CollectionModel.of(componentModels, linkTo(methodOn(FormulaController.class).allFormulaComponents()).withSelfRel());
    }

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @GetMapping("/formula-component/{id}")
    public EntityModel<FormulaComponent> oneFormulaComponent(@PathVariable("id") Long id) {
        LOGGER.info("Fetching formula component with ID: " + id);
        FormulaComponent component = service.getFormulaComponent(id);

        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!courseService.allowCourseViewing(person, repository.findCourseId(component.getIdFormula())))
            throw new UnauthorizedOperationException("Only students enrolled in the formula's course or professors who teach the course may see its formula's components");

        return EntityModel.of(component,
                linkTo(methodOn(FormulaController.class).oneFormulaComponent(id)).withSelfRel(),
                linkTo(methodOn(FormulaController.class).allFormulaComponents()).withRel("formulas-components"));
    }

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @PostMapping("/formula-component")
    public ResponseEntity<?> newFormulaComponent(@RequestBody FormulaComponent newComponent) {
        LOGGER.info("Creating new formula component");
        newComponent.setId(null); // Enforce DB-generated ID

        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!courseService.authorizeCourseOperation(person, repository.findCourseId(newComponent.getIdFormula()), true))
            throw new UnauthorizedOperationException("Only professors who teach the course may add a formula component");

        service.addFormulaComponent(newComponent);
        EntityModel<FormulaComponent> entityModel = EntityModel.of(newComponent,
                linkTo(methodOn(FormulaController.class).oneFormulaComponent(newComponent.getId())).withSelfRel());
        return ResponseEntity.created(entityModel.getRequiredLink(IanaLinkRelations.SELF).toUri()).build();
    }

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @PutMapping("/formula-component/{id}")
    public ResponseEntity<?> replaceFormulaComponent(@PathVariable("id") Long id, @RequestBody FormulaComponent newComponent) {
        LOGGER.info("Updating formula component with ID: " + id);

        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!courseService.authorizeCourseOperation(person, repository.findCourseId(newComponent.getIdFormula()), true))
            throw new UnauthorizedOperationException("Only professors who teach the course may change a formula component");

        FormulaComponent updatedComponent = service.getFormulaComponent(id);
        if(!updatedComponent.getIdFormula().equals(newComponent.getIdFormula()))
        {
            if(!courseService.authorizeCourseOperation(person, repository.findCourseId(updatedComponent.getIdFormula()), true))
                throw new UnauthorizedOperationException("Only professors who teach the course may change a formula component");
        }

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
        FormulaComponent deletedComponent = service.getFormulaComponent(id);
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!courseService.authorizeCourseOperation(person, repository.findCourseId(deletedComponent.getIdFormula()), true))
            throw new UnauthorizedOperationException("Only professors who teach the course may delete a formula component");

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
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!courseService.allowCourseViewing(person, componentRepository.findCourseId(idComponent)))
            throw new UnauthorizedOperationException("Only students enrolled in the formula's course or professors who teach the course may see its formula's components' scores");

        return service.getComponentScore(new ComponentScoreCompositeKey(idStud, idComponent));
    }

    @GetMapping("/component-score/all/by-component")
    public List<ComponentScore> getScoresByComponent(@RequestParam Long idComponent)
    {
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!courseService.allowCourseViewing(person, componentRepository.findCourseId(idComponent)))
            throw new UnauthorizedOperationException("Only students enrolled in the formula's course or professors who teach the course may see its formula's components' scores");

        return service.getComponentScoresByIdComponent(idComponent);
    }

    @GetMapping("/component-score/all/by-student")
    public List<ComponentScore> getScoresByStudent(@RequestParam Long idStud)
    {
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        return service.getComponentScoresByIdStud(idStud).stream().filter(c -> courseService.allowCourseViewing(person, componentRepository.findCourseId(c.getId().getIdComponent()))).toList();
    }

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @PostMapping("/component-score")
    public void addScore(@RequestBody ComponentScore score)
    {
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!courseService.authorizeCourseOperation(person, componentRepository.findCourseId(score.getId().getIdComponent()), true))
            throw new UnauthorizedOperationException("Only professors who teach the course may add a formula component score");

        service.addComponentScore(score);
    }

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @PutMapping("/component-score")
    public void modifyScore(@RequestBody ComponentScore score)
    {
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!courseService.authorizeCourseOperation(person, componentRepository.findCourseId(score.getId().getIdComponent()), true))
            throw new UnauthorizedOperationException("Only professors who teach the course may modify a formula component score");

        ComponentScore existingScore = service.getComponentScore(score.getId());
        if(!score.getId().getIdComponent().equals(existingScore.getId().getIdComponent()) && !courseService.authorizeCourseOperation(person, componentRepository.findCourseId(existingScore.getId().getIdComponent()), true))
            throw new UnauthorizedOperationException("Only professors who teach the course may modify a formula component score");

        existingScore.setValue(score.getValue());
        service.addComponentScore(existingScore);
    }

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @DeleteMapping("/component-score")
    public void deleteScore(@RequestParam Long idStud, @RequestParam Long idComponent)
    {
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!courseService.authorizeCourseOperation(person, componentRepository.findCourseId(idComponent), true))
            throw new UnauthorizedOperationException("Only professors who teach the course may delete a formula component score");

        ComponentScore score = service.getComponentScore(new ComponentScoreCompositeKey(idStud, idComponent));
        service.deleteComponentScore(score);
    }

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @DeleteMapping("/component-score/all/by-component")
    public void deleteAllScoresByComponent(@RequestParam Long idComponent)
    {
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        if(!courseService.authorizeCourseOperation(person, componentRepository.findCourseId(idComponent), true))
            throw new UnauthorizedOperationException("Only professors who teach the course may delete a formula component score");

        List<ComponentScore> scores = service.getComponentScoresByIdComponent(idComponent);

        scores.forEach(service::deleteComponentScore);
    }

    @PreAuthorize("hasRole('PROFESOR') or hasRole('ADMIN')")
    @DeleteMapping("/component-score/all/by-student")
    public void deleteAllScoresByStudent(@RequestParam Long idStud)
    {
        PersonInfoDTO person = (PersonInfoDTO) personController.getCurrentUserInfo().getBody();
        List<ComponentScore> scores = service.getComponentScoresByIdStud(idStud).stream().filter(s -> courseService.authorizeCourseOperation(person, componentRepository.findCourseId(s.getId().getIdComponent()), true)).toList();

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