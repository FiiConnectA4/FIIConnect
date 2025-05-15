package com.fiiconnect.api.didactic.helpers.formula.tree;

import com.fiiconnect.api.didactic.exceptions.FormulaEvaluateException;
import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class OperatorTreeNode extends AbstractTreeNode{
    private char operator;

    public OperatorTreeNode(char operator)
    {
        this.type = TreeNodeType.OPERATOR_NODE;
        this.operator = operator;
    }

    @Override
    public Double evaluateTree(Map<String, Double> variableValues) {
        Double leftValue = this.children.getFirst().evaluateTree(variableValues);
        Double rightValue = this.children.get(1).evaluateTree(variableValues);
        return switch (operator) {
            case '+' -> leftValue + rightValue;
            case '-' -> leftValue - rightValue;
            case '*' -> leftValue * rightValue;
            case '/' -> leftValue / rightValue;
            case '^' -> Math.pow(leftValue, rightValue);
            default -> throw new FormulaEvaluateException("Cannot evaluate operator: " + this.operator);
        };
    }
}
