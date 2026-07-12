package com.you.lld.problems.querydsl.model;

/**
 * Comparison operators supported by the DSL. Each operator knows how many operand
 * values it accepts, so arity is enforced once, at construction time (fail fast),
 * instead of being re-checked by every backend.
 */
public enum Operator {
    EQ("=", 1, 1),
    NEQ("!=", 1, 1),
    GT(">", 1, 1),
    GTE(">=", 1, 1),
    LT("<", 1, 1),
    LTE("<=", 1, 1),
    IN("IN", 1, Integer.MAX_VALUE),
    NOT_IN("NOT IN", 1, Integer.MAX_VALUE),
    CONTAINS("CONTAINS", 1, 1),
    STARTS_WITH("STARTS WITH", 1, 1),
    BETWEEN("BETWEEN", 2, 2),
    IS_NULL("IS NULL", 0, 0),
    IS_NOT_NULL("IS NOT NULL", 0, 0);

    private final String symbol;
    private final int minValues;
    private final int maxValues;

    Operator(String symbol, int minValues, int maxValues) {
        this.symbol = symbol;
        this.minValues = minValues;
        this.maxValues = maxValues;
    }

    public String symbol() { return symbol; }

    public void validateArity(int valueCount) {
        if (valueCount < minValues || valueCount > maxValues) {
            throw new InvalidQueryException(
                name() + " expects " + (minValues == maxValues
                    ? minValues + " value(s)"
                    : "between " + minValues + " and " + maxValues + " values")
                + " but got " + valueCount);
        }
    }
}
