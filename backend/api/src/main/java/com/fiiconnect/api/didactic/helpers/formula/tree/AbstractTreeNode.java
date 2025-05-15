package com.fiiconnect.api.didactic.helpers.formula.tree;

import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Getter
@Setter
public abstract class AbstractTreeNode {
    protected TreeNodeType type;
    protected List<AbstractTreeNode> children;

    public AbstractTreeNode()
    {
        this.children = new ArrayList<>();
    }

    abstract public Double evaluateTree(Map<String, Double> variableValues);
}
