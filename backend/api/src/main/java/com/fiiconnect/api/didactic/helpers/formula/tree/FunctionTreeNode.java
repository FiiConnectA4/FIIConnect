package com.fiiconnect.api.didactic.helpers.formula.tree;

import com.fiiconnect.api.didactic.exceptions.FormulaEvaluateException;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class FunctionTreeNode extends AbstractTreeNode {
    private String function;

    public FunctionTreeNode(String function)
    {
        this.type = TreeNodeType.OPERATOR_NODE;
        this.function = function;
    }

    @Override
    public Double evaluateTree(Map<String, Double> variableValues) {
        switch(function)
        {
            case "min":
            {
                Double leftValue = this.children.getFirst().evaluateTree(variableValues);
                Double rightValue = this.children.get(1).evaluateTree(variableValues);
                return Math.min(leftValue, rightValue);
            }
            case "max":
            {
                Double leftValue = this.children.getFirst().evaluateTree(variableValues);
                Double rightValue = this.children.get(1).evaluateTree(variableValues);
                return Math.max(leftValue, rightValue);
            }
            case "clamp":
            {
                Double value = this.children.getFirst().evaluateTree(variableValues);
                Double minValue = this.children.get(1).evaluateTree(variableValues);
                Double maxValue = this.children.get(2).evaluateTree(variableValues);
                return Math.clamp(value, minValue, maxValue);
            }
            case "floor":
            {
                Double value = this.children.getFirst().evaluateTree(variableValues);
                return Math.floor(value);
            }
            case "round":
            {
                Double value = this.children.getFirst().evaluateTree(variableValues);
                return (double)Math.round(value);
            }
            case "ceil":
            {
                Double value = this.children.getFirst().evaluateTree(variableValues);
                return Math.ceil(value);
            }
            default: throw new FormulaEvaluateException("Cannot evaluate function: " + this.function);
        }
    }
}
