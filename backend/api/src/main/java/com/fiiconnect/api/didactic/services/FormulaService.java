package com.fiiconnect.api.didactic.services;

import com.fiiconnect.api.didactic.exceptions.FormulaNotFoundException;
import com.fiiconnect.api.didactic.models.Formula;
import com.fiiconnect.api.didactic.models.FormulaComponent;
import com.fiiconnect.api.didactic.repositories.FormulaComponentRepository;
import com.fiiconnect.api.didactic.repositories.FormulaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FormulaService {
    private final FormulaRepository formulaRepository;
    private final FormulaComponentRepository componentRepository;

    @Autowired
    public FormulaService(FormulaRepository formulaRepository, FormulaComponentRepository componentRepository) {
        this.formulaRepository = formulaRepository;
        this.componentRepository = componentRepository;
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
                .orElseThrow(() -> new FormulaNotFoundException(componentId));
    }

    public List<FormulaComponent> viewAllFormulaComponents() {
        return componentRepository.findAll();
    }

    public void attachComponents(Formula formula) {
        List<FormulaComponent> components = componentRepository.findAll().stream()
                .filter(c -> c.getIdFormula().equals(formula.getId()))
                .toList();
        formula.setComponents(components);
    }
}