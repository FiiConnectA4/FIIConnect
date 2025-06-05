package com.fiiconnect.api.didactic.helpers.formula.tree;

import com.fiiconnect.api.didactic.exceptions.FormulaEvaluateException;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class VariableTreeNode extends AbstractTreeNode{
    private String variable;

    public VariableTreeNode(String variable)
    {
        this.type = TreeNodeType.VARIABLE_NODE;
        this.variable = variable;
    }

    @Override
    public Double evaluateTree(Map<String, Double> variableValues) {
        if(!variableValues.containsKey(this.variable))
            throw new FormulaEvaluateException("Cannot get score of: " + this.variable);

        return variableValues.get(this.variable);
    }
}
