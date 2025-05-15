package com.fiiconnect.api.didactic.services;

import com.fiiconnect.api.didactic.exceptions.ComponentNotFoundException;
import com.fiiconnect.api.didactic.exceptions.ComponentScoreNotFoundException;
import com.fiiconnect.api.didactic.exceptions.FormulaEvaluateException;
import com.fiiconnect.api.didactic.exceptions.FormulaNotFoundException;
import com.fiiconnect.api.didactic.models.ComponentScore;
import com.fiiconnect.api.didactic.models.ComponentScoreCompositeKey;
import com.fiiconnect.api.didactic.models.Formula;
import com.fiiconnect.api.didactic.models.FormulaComponent;
import com.fiiconnect.api.didactic.repositories.ComponentScoreRepository;
import com.fiiconnect.api.didactic.repositories.FormulaComponentRepository;
import com.fiiconnect.api.didactic.repositories.FormulaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@Service
public class FormulaService {
    private static final Logger LOGGER = Logger.getLogger(FormulaService.class.getName());

    private final FormulaRepository formulaRepository;
    private final FormulaComponentRepository componentRepository;
    private final ComponentScoreRepository scoreRepository;

    @Autowired
    public FormulaService(FormulaRepository formulaRepository, FormulaComponentRepository componentRepository, ComponentScoreRepository scoreRepository) {
        this.formulaRepository = formulaRepository;
        this.componentRepository = componentRepository;
        this.scoreRepository = scoreRepository;
    }

    public void addFormula(Formula formula) {
        formulaRepository.save(formula);
    }

    public void deleteFormula(Long formulaId) {
        formulaRepository.deleteById(formulaId);
    }

    public Formula getFormula(Long formulaId) {
        Formula formula = formulaRepository.findById(formulaId)
                .orElseThrow(() -> new FormulaNotFoundException(formulaId));
        attachComponents(formula);
        return formula;
    }

    public Formula getFormulaByCourseId(Long idCourse) {
        Formula formula = formulaRepository.findByIdCourse(idCourse)
                .orElseThrow(() -> new FormulaNotFoundException("No formula found for course ID: " + idCourse));
        attachComponents(formula);
        return formula;
    }

    public List<Formula> viewAllFormulas() {
        return formulaRepository.findAll();
    }

    public void addFormulaComponent(FormulaComponent component) {
        componentRepository.save(component);
    }

    public void deleteFormulaComponent(Long componentId) {
        componentRepository.deleteById(componentId);
    }

    public FormulaComponent getFormulaComponent(Long componentId) {
        return componentRepository.findById(componentId)
                .orElseThrow(() -> new ComponentNotFoundException(componentId));
    }

    public List<FormulaComponent> viewAllFormulaComponents() {
        return componentRepository.findAll();
    }

    public ComponentScore getComponentScore(ComponentScoreCompositeKey id)
    {
        return scoreRepository.findById(id).orElseThrow(() -> new ComponentScoreNotFoundException(id));
    }

    public List<ComponentScore> getComponentScoresByIdComponent(Long idComponent)
    {
        return scoreRepository.findByIdIdComponent(idComponent);
    }

    public List<ComponentScore> getComponentScoresByIdStud(Long idStud)
    {
        return scoreRepository.findByIdIdStud(idStud);
    }

    public void addComponentScore(ComponentScore score)
    {
        scoreRepository.save(score);
    }

    public void deleteComponentScore(ComponentScore score)
    {
        scoreRepository.delete(score);
    }

    public void attachComponents(Formula formula) {
        LOGGER.info("Attaching components for formula ID: " + formula.getId() + ", type: " + formula.getId().getClass().getName());
        List<FormulaComponent> components = componentRepository.findByIdFormula(formula.getId());
        LOGGER.info("Found " + components.size() + " components");
        formula.getComponents().clear();
        formula.getComponents().addAll(components);
    }

    public Double evaluateFormula(Formula formula, Long idStud)
    {
        List<Long> componentIds = formula.getComponents().stream().map(FormulaComponent::getId).toList();
        List<ComponentScore> studentScores = scoreRepository.findByIdIdStudAndIdIdComponentIn(idStud, componentIds);
        if(studentScores.size() < componentIds.size())
            throw new FormulaEvaluateException("Student with id "  + idStud + " does not have scores for all components");

        Map<String, Double> variableValues = new HashMap<>();
        for(ComponentScore score : studentScores)
        {
            FormulaComponent component = formula.getComponents().stream().filter(c -> c.getId().equals(score.getId().getIdComponent())).findFirst().orElseThrow(() -> new RuntimeException("invalid data"));
            variableValues.put(component.getName(), score.getValue());
        }
        return formula.getTreeRoot().evaluateTree(variableValues);
    }
}