package com.fiiconnect.api.didactic.services;

import com.fiiconnect.api.didactic.exceptions.ComponentNotFoundException;
import com.fiiconnect.api.didactic.exceptions.ComponentScoreNotFoundException;
import com.fiiconnect.api.didactic.exceptions.FormulaEvaluateException;
import com.fiiconnect.api.didactic.exceptions.FormulaNotFoundException;
import com.fiiconnect.api.didactic.models.*;
import com.fiiconnect.api.didactic.repositories.ComponentScoreRepository;
import com.fiiconnect.api.didactic.repositories.FormulaComponentRepository;
import com.fiiconnect.api.didactic.repositories.FormulaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
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
        formulaRepository.flush();
    }

    public void deleteFormula(Long formulaId) {
        formulaRepository.deleteById(formulaId);
    }

    public Formula getFormula(Long formulaId, boolean attach) {
        Formula formula = formulaRepository.findById(formulaId)
                .orElseThrow(() -> new FormulaNotFoundException(formulaId));
        if(attach)
            attachComponents(formula);
        return formula;
    }

    public Formula getFormula(Long formulaId) {
        return getFormula(formulaId, true);
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

    public List<Grade> applyGaussScaling(List<Grade> grades)
    {
        List<Grade> outputGrades = new ArrayList<>();
        List<Grade> sortedGrades = new ArrayList<>();
        grades.stream().filter(g -> g.getValue() >= 4.5).sorted((a,b) -> {double dif = a.getValue() - b.getValue(); if(dif < 0) return 1; if(dif == 0) return 0; return -1;}).forEach(sortedGrades::add);

        int endIndex10, endIndex9, endIndex8, endIndex7, endIndex6;

        endIndex10 = (int) Math.round(sortedGrades.size() * 0.1);
        if(endIndex10 == 0)
            endIndex10 = 1;

        endIndex9 = endIndex10 + (int) Math.round(sortedGrades.size() * 0.25);
        if(endIndex9 == endIndex10)
            endIndex9++;

        endIndex8 = endIndex9 + (int) Math.round(sortedGrades.size() * 0.3);
        if(endIndex8 == endIndex9)
            endIndex8++;

        endIndex7 = endIndex8 + (int) Math.round(sortedGrades.size() * 0.25);
        if(endIndex7 == endIndex8)
            endIndex7++;

        endIndex6 = sortedGrades.size();
        if(endIndex6 < endIndex7)
            endIndex6 = endIndex7 + 1;

        double[] gradeArray = new double[]{10, 9, 8, 7, 6};
        int[] indexArray = new int[]{endIndex10, endIndex9, endIndex8, endIndex7, endIndex6};

        int currentArrayIndex = 0;
        Double prevGrade = 10.0;
        for(int i = 0; i < sortedGrades.size(); i++)
        {
            Grade currentGrade = sortedGrades.get(i);
            if(i >= indexArray[currentArrayIndex] && !currentGrade.getValue().equals(prevGrade))
                currentArrayIndex++;

            outputGrades.add(new Grade(new GradeCompositeKey(currentGrade.getId().getIdStud().longValue(), currentGrade.getId().getIdCourse().longValue()), gradeArray[currentArrayIndex], Date.from(currentGrade.getGradingDate().toInstant())));
            prevGrade = currentGrade.getValue();
        }

//        sortedGrades.stream().limit(endIndex10).forEach(g -> outputGrades.add(new Grade(new GradeCompositeKey(g.getId().getIdStud().longValue(), g.getId().getIdCourse().longValue()), 10.0, Date.from(g.getGradingDate().toInstant()))));
//        sortedGrades.stream().skip(endIndex10).limit(endIndex9 - endIndex10).forEach(g -> outputGrades.add(new Grade(new GradeCompositeKey(g.getId().getIdStud().longValue(), g.getId().getIdCourse().longValue()), 9.0, Date.from(g.getGradingDate().toInstant()))));
//        sortedGrades.stream().skip(endIndex9).limit(endIndex8 - endIndex9).forEach(g -> outputGrades.add(new Grade(new GradeCompositeKey(g.getId().getIdStud().longValue(), g.getId().getIdCourse().longValue()), 8.0, Date.from(g.getGradingDate().toInstant()))));
//        sortedGrades.stream().skip(endIndex8).limit(endIndex7 - endIndex8).forEach(g -> outputGrades.add(new Grade(new GradeCompositeKey(g.getId().getIdStud().longValue(), g.getId().getIdCourse().longValue()), 7.0, Date.from(g.getGradingDate().toInstant()))));
//        sortedGrades.stream().skip(endIndex7).limit(endIndex6 - endIndex7).forEach(g -> outputGrades.add(new Grade(new GradeCompositeKey(g.getId().getIdStud().longValue(), g.getId().getIdCourse().longValue()), 6.0, Date.from(g.getGradingDate().toInstant()))));

        grades.stream().filter(g -> g.getValue() < 4.5).forEach(g -> outputGrades.add(new Grade(new GradeCompositeKey(g.getId().getIdStud().longValue(), g.getId().getIdCourse().longValue()), g.getValue().doubleValue(), Date.from(g.getGradingDate().toInstant()))));
        return outputGrades;
    }

    public List<Grade> applyBestScaling(List<Grade> grades)
    {
        List<Grade> outputGrades = new ArrayList<>();
        Grade maxGrade = grades.stream().filter(g -> g.getValue() >= 4.5).max((a,b) -> {double dif = a.getValue() - b.getValue(); if(dif < 0) return -1; if(dif == 0) return 0; return 1;}).orElse(null);
        if(maxGrade == null)
            return grades;

        grades.stream().filter(g -> g.getValue() >= 4.5).forEach(g -> outputGrades.add(new Grade(new GradeCompositeKey(g.getId().getIdStud().longValue(), g.getId().getIdCourse().longValue()), g.getValue() / maxGrade.getValue() * 10, Date.from(g.getGradingDate().toInstant()))));
        grades.stream().filter(g -> g.getValue() < 4.5).forEach(g -> outputGrades.add(new Grade(new GradeCompositeKey(g.getId().getIdStud().longValue(), g.getId().getIdCourse().longValue()), g.getValue().doubleValue(), Date.from(g.getGradingDate().toInstant()))));
        return outputGrades;
    }
}