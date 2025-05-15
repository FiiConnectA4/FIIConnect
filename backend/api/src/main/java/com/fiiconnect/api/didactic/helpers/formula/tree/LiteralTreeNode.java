package com.fiiconnect.api.didactic.helpers.formula.tree;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class LiteralTreeNode extends AbstractTreeNode {
    private Double value;

    public LiteralTreeNode(Double value)
    {
        this.type = TreeNodeType.LITERAL_NODE;
        this.value = value;
    }

    @Override
    public Double evaluateTree(Map<String, Double> variableValues) {
        return value;
    }
}
