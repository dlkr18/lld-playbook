package com.you.lld.problems.querydsl.model;

import com.you.lld.problems.querydsl.service.ConditionVisitor;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/** Leaf of the filter AST: {@code field <op> value(s)}. Immutable; arity checked at build time. */
public final class Comparison implements Condition {

    private final String field;
    private final Operator op;
    private final List<Object> values;

    public Comparison(String field, Operator op, List<Object> values) {
        if (field == null || field.trim().isEmpty()) {
            throw new InvalidQueryException("comparison field is required");
        }
        if (op == null) {
            throw new InvalidQueryException("operator is required");
        }
        List<Object> copy = (values == null)
            ? new ArrayList<Object>()
            : new ArrayList<Object>(values);
        op.validateArity(copy.size());
        this.field = field;
        this.op = op;
        this.values = Collections.unmodifiableList(copy);
    }

    public String field() { return field; }
    public Operator op() { return op; }
    public List<Object> values() { return values; }

    /** Convenience for single-operand operators. */
    public Object singleValue() { return values.get(0); }

    public <T> T accept(ConditionVisitor<T> visitor) {
        return visitor.visitComparison(this);
    }
}
