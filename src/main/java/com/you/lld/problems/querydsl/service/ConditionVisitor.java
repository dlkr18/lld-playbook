package com.you.lld.problems.querydsl.service;

import com.you.lld.problems.querydsl.model.Comparison;
import com.you.lld.problems.querydsl.model.LogicalCondition;
import com.you.lld.problems.querydsl.model.NotCondition;

/**
 * Visitor over the Condition AST. Every backend concern (SQL rendering, in-memory
 * evaluation, Mongo rendering, validation) is one implementation of this interface —
 * the model never learns about any of them.
 *
 * Chosen over the alternatives:
 * - toSql()/toPredicate() methods ON the model — couples the AST to every current and
 *   future backend; adding Elasticsearch would mean editing every node class.
 * - instanceof chains in each backend — no compile-time exhaustiveness; a new node
 *   type fails silently at runtime instead of failing to compile.
 */
public interface ConditionVisitor<T> {
    T visitComparison(Comparison comparison);
    T visitLogical(LogicalCondition logical);
    T visitNot(NotCondition not);
}
