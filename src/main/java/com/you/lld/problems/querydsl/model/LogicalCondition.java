package com.you.lld.problems.querydsl.model;

import com.you.lld.problems.querydsl.service.ConditionVisitor;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/** Composite AND/OR over one or more child conditions. */
public final class LogicalCondition implements Condition {

    public enum Op { AND, OR }

    private final Op op;
    private final List<Condition> children;

    public LogicalCondition(Op op, List<Condition> children) {
        if (children == null || children.isEmpty()) {
            throw new InvalidQueryException(op + " requires at least one child condition");
        }
        for (Condition c : children) {
            if (c == null) throw new InvalidQueryException(op + " child must not be null");
        }
        this.op = op;
        this.children = Collections.unmodifiableList(new ArrayList<Condition>(children));
    }

    public Op op() { return op; }
    public List<Condition> children() { return children; }

    public <T> T accept(ConditionVisitor<T> visitor) {
        return visitor.visitLogical(this);
    }
}
