package com.fiiconnect.api.didactic.helpers.formula;

import com.fiiconnect.api.didactic.exceptions.FormulaParseException;
import com.fiiconnect.api.didactic.helpers.formula.tree.*;
import com.fiiconnect.api.didactic.models.Formula;

import java.util.List;
import java.util.Stack;

public class FormulaParser {

    public static List<String> functions = List.of("min", "max", "clamp", "round", "floor", "ceil");

    public static void createSyntaxTree(Formula formula)
    {
        ParserState state = ParserState.STATE_START;

        Stack<String> operatorStack = new Stack<>();
        Stack<AbstractTreeNode> treeStack = new Stack<>();
        String text = formula.getText();
        boolean foundEquals = text.indexOf('=') == -1;
        for(int index = 0; index < text.length(); index++)
        {
            char ch = text.charAt(index);
            if(ch == ' ')
                continue;
            if(ch == '=')
            {
                if(foundEquals)
                    throw new FormulaParseException("Too many equal signs at index " + index);
                foundEquals = true;
                continue;
            }
            if(!foundEquals)
                continue;

            if(ch == '(')
            {
                if(state != ParserState.STATE_START && state != ParserState.STATE_READ_OPERATOR && state != ParserState.STATE_READ_FUNCTION)
                    throw new FormulaParseException("Unexpected open parentheses at index " + index);

                operatorStack.push("(");
                state = ParserState.STATE_READ_PARAN_OPEN;
            }
            else if(ch == ')')
            {
                if(state != ParserState.STATE_READ_VARIABLE && state != ParserState.STATE_READ_NUMBER)
                    throw new FormulaParseException("Unexpected close parentheses at index " + index);

                while(true)
                {
                    if(operatorStack.isEmpty())
                        throw new FormulaParseException("Unexpected close parentheses at index " + index);

                    if(operatorStack.peek().equals("("))
                    {
                        operatorStack.pop();
                        break;
                    }

                    buildTree(operatorStack, treeStack);
                }

                if(!operatorStack.isEmpty() && functions.contains(operatorStack.peek()))
                    buildTree(operatorStack, treeStack);

                state = ParserState.STATE_READ_PARAN_CLOSE;
            }
            else if("+-*/^,".indexOf(ch) != -1)
            {
                if(state != ParserState.STATE_READ_NUMBER && state != ParserState.STATE_READ_VARIABLE && state != ParserState.STATE_READ_PARAN_CLOSE)
                    throw new FormulaParseException("Unexpected operator " + ch + " at index " + index);

                String operatorString = "" + ch;
                while(!operatorStack.isEmpty() && operatorPrecedence(operatorStack.peek()) >= operatorPrecedence(operatorString))
                    buildTree(operatorStack, treeStack);

                operatorStack.push(operatorString);
                state = ParserState.STATE_READ_OPERATOR;
            }
            else if(Character.isDigit(ch))
            {
                if(state != ParserState.STATE_READ_OPERATOR && state != ParserState.STATE_READ_PARAN_OPEN && state != ParserState.STATE_START)
                    throw new FormulaParseException("Unexpected digit " + ch + " at index " + index);

                int lastIndex = index;
                while(lastIndex < text.length() && (Character.isDigit(text.charAt(lastIndex)) || text.charAt(lastIndex) == '.'))
                    lastIndex++;

                String literalString = text.substring(index, lastIndex);
                treeStack.push(new LiteralTreeNode(Double.parseDouble(literalString)));
                index = lastIndex - 1;
                state = ParserState.STATE_READ_NUMBER;
            }
            else if(Character.isLetter(ch))
            {
                if(state != ParserState.STATE_READ_OPERATOR && state != ParserState.STATE_READ_PARAN_OPEN && state != ParserState.STATE_START)
                    throw new FormulaParseException("Unexpected letter " + ch + " at index " + index);

                int lastIndex = index;
                while(lastIndex < text.length() && Character.isLetterOrDigit(text.charAt(lastIndex)))
                    lastIndex++;

                String variableString = text.substring(index, lastIndex);
                if(functions.contains(variableString))
                {
                    operatorStack.push(variableString);
                    state = ParserState.STATE_READ_FUNCTION;
                }
                else
                {
                    treeStack.push(new VariableTreeNode(variableString));
                    state = ParserState.STATE_READ_VARIABLE;
                }

                index = lastIndex - 1;
            }
            else
                throw new FormulaParseException("Illegal character " + ch + " at index " + index);
        }

        while(!operatorStack.isEmpty())
            buildTree(operatorStack, treeStack);
        if(treeStack.size() != 1)
            throw new FormulaParseException("Invalid usage of comma or invalid count of arguments");
        formula.setTreeRoot(treeStack.pop());
    }

    public static int operatorPrecedence(String operator)
    {
        return switch(operator)
        {
            case "(" -> 0;
            case "+", "-" -> 1;
            case "*", "/" -> 2;
            case "^" -> 3;
            case "min", "max", "clamp", "round", "floor", "ceil" -> 4;
            case "," -> 10;
            default -> throw new FormulaParseException("Invalid operator: " + operator);
        };
    }

    public static void buildTree(Stack<String> operatorStack, Stack<AbstractTreeNode> treeStack)
    {
        if(operatorStack.isEmpty())
            throw new FormulaParseException("Invalid usage of operators or functions or comma operator");

        String operator = operatorStack.pop();
        if(operator.equals(","))
            return; //do nothing

        if(treeStack.isEmpty())
            throw new FormulaParseException("Invalid usage of operators or functions or comma operator");
        AbstractTreeNode tree = treeStack.pop();
        switch (operator)
        {
            case "+", "-", "*", "/", "^":
            {
                char op = operator.charAt(0);
                if(treeStack.isEmpty())
                    throw new FormulaParseException("Invalid usage of operators or functions or comma operator");
                AbstractTreeNode otherTree = treeStack.pop();
                AbstractTreeNode newTree = new OperatorTreeNode(op);
                newTree.getChildren().add(otherTree);
                newTree.getChildren().add(tree);
                treeStack.push(newTree);
                break;
            }
            case "min", "max", "clamp", "round", "floor", "ceil":
            {
                AbstractTreeNode newTree = new FunctionTreeNode(operator);
                switch(operator)
                {
                    case "min", "max":
                    {
                        if(treeStack.isEmpty())
                            throw new FormulaParseException("Invalid usage of operators or functions or comma operator");
                        AbstractTreeNode otherTree = treeStack.pop();
                        newTree.getChildren().add(otherTree);
                        newTree.getChildren().add(tree);
                        break;
                    }
                    case "clamp":
                    {
                        if(treeStack.size() < 2)
                            throw new FormulaParseException("Invalid usage of operators or functions or comma operator");
                        AbstractTreeNode secondTree = treeStack.pop();
                        AbstractTreeNode firstTree = treeStack.pop();
                        newTree.getChildren().add(firstTree);
                        newTree.getChildren().add(secondTree);
                        newTree.getChildren().add(tree);
                        break;
                    }
                    case "round", "floor", "ceil":
                    {
                        newTree.getChildren().add(tree);
                        break;
                    }
                }
                treeStack.push(newTree);
                break;
            }
            default: throw new FormulaParseException("Invalid operator/function: " + operator);
        }
    }
}
