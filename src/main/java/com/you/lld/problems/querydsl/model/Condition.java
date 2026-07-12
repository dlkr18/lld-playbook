package com.you.lld.problems.querydsl.model;

import com.you.lld.problems.querydsl.service.ConditionVisitor;

/**
 * Composite node of the filter AST. A condition is either a leaf {@link Comparison}
 * or a boolean combinator ({@link LogicalCondition}, {@link NotCondition}).
 *
 * The model deliberately has NO rendering/evaluation logic — backends walk the tree
 * via {@link ConditionVisitor} (Visitor pattern), so adding a new backend never
 * touches these classes (Open/Closed).
 */
public interface Condition {
    <T> T accept(ConditionVisitor<T> visitor);
}
