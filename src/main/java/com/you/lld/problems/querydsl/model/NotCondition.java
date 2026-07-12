package com.you.lld.problems.querydsl.model;

import com.you.lld.problems.querydsl.service.ConditionVisitor;

/** Negation of a child condition. */
public final class NotCondition implements Condition {

    private final Condition child;

    public NotCondition(Condition child) {
        if (child == null) throw new InvalidQueryException("NOT requires a child condition");
        this.child = child;
    }

    public Condition child() { return child; }

    public <T> T accept(ConditionVisitor<T> visitor) {
        return visitor.visitNot(this);
    }
}
