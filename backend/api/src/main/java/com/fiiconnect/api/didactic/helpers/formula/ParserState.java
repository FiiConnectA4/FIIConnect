package com.fiiconnect.api.didactic.helpers.formula;

public enum ParserState {
    STATE_START,
    STATE_READ_VARIABLE,
    STATE_READ_NUMBER,
    STATE_READ_FUNCTION,
    STATE_READ_OPERATOR,
    STATE_READ_PARAN_OPEN,
    STATE_READ_PARAN_CLOSE
}
