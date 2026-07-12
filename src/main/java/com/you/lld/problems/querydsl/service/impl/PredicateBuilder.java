package com.you.lld.problems.querydsl.service.impl;

import com.you.lld.problems.querydsl.model.Comparison;
import com.you.lld.problems.querydsl.model.Condition;
import com.you.lld.problems.querydsl.model.InvalidQueryException;
import com.you.lld.problems.querydsl.model.LogicalCondition;
import com.you.lld.problems.querydsl.model.NotCondition;
import com.you.lld.problems.querydsl.service.ConditionVisitor;

import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.function.Predicate;

/**
 * AST -> java.util.function.Predicate over a row. This is the Interpreter role:
 * the in-memory backend "runs" the query by evaluating the tree per row.
 *
 * Semantics decisions (state these in the interview):
 * - Comparing against a missing/null field is FALSE (SQL-like), except IS_NULL.
 * - Numbers compare numerically across boxed types (Integer 5 == Long 5).
 * - CONTAINS / STARTS_WITH are case-sensitive string operations.
 */
public final class PredicateBuilder implements ConditionVisitor<Predicate<Map<String, Object>>> {

    public Predicate<Map<String, Object>> visitComparison(final Comparison c) {
        final String field = c.field();
        switch (c.op()) {
            case EQ:  return new Predicate<Map<String, Object>>() {
                public boolean test(Map<String, Object> row) { return valueEquals(row.get(field), c.singleValue()); } };
            case NEQ: return new Predicate<Map<String, Object>>() {
                public boolean test(Map<String, Object> row) { return row.get(field) != null && !valueEquals(row.get(field), c.singleValue()); } };
            case GT:  return ordered(field, c.singleValue(), 1, false);
            case GTE: return ordered(field, c.singleValue(), 1, true);
            case LT:  return ordered(field, c.singleValue(), -1, false);
            case LTE: return ordered(field, c.singleValue(), -1, true);
            case IN:  return inList(field, c.values(), true);
            case NOT_IN: return inList(field, c.values(), false);
            case CONTAINS: return new Predicate<Map<String, Object>>() {
                public boolean test(Map<String, Object> row) {
                    Object v = row.get(field);
                    return v != null && String.valueOf(v).contains(String.valueOf(c.singleValue()));
                } };
            case STARTS_WITH: return new Predicate<Map<String, Object>>() {
                public boolean test(Map<String, Object> row) {
                    Object v = row.get(field);
                    return v != null && String.valueOf(v).startsWith(String.valueOf(c.singleValue()));
                } };
            case BETWEEN: {
                final Object lo = c.values().get(0);
                final Object hi = c.values().get(1);
                return new Predicate<Map<String, Object>>() {
                    public boolean test(Map<String, Object> row) {
                        Object v = row.get(field);
                        Integer a = compareValues(v, lo);
                        Integer b = compareValues(v, hi);
                        return a != null && b != null && a >= 0 && b <= 0;   // inclusive both ends
                    } };
            }
            case IS_NULL: return new Predicate<Map<String, Object>>() {
                public boolean test(Map<String, Object> row) { return row.get(field) == null; } };
            case IS_NOT_NULL: return new Predicate<Map<String, Object>>() {
                public boolean test(Map<String, Object> row) { return row.get(field) != null; } };
            default:
                throw new InvalidQueryException("unsupported operator: " + c.op());
        }
    }

    public Predicate<Map<String, Object>> visitLogical(LogicalCondition l) {
        Predicate<Map<String, Object>> combined = null;
        for (Condition child : l.children()) {
            Predicate<Map<String, Object>> p = child.accept(this);
            if (combined == null) combined = p;
            else combined = (l.op() == LogicalCondition.Op.AND) ? combined.and(p) : combined.or(p);
        }
        return combined;
    }

    public Predicate<Map<String, Object>> visitNot(NotCondition n) {
        return n.child().accept(this).negate();
    }

    // ── value semantics helpers (shared with sorting) ──────────────────────────

    private Predicate<Map<String, Object>> ordered(final String field, final Object target,
                                                   final int sign, final boolean orEqual) {
        return new Predicate<Map<String, Object>>() {
            public boolean test(Map<String, Object> row) {
                Integer c = compareValues(row.get(field), target);
                if (c == null) return false;                    // null/incomparable never matches
                return (orEqual && c == 0) || Integer.signum(c) == sign;
            }
        };
    }

    private Predicate<Map<String, Object>> inList(final String field, final List<Object> values,
                                                  final boolean shouldContain) {
        return new Predicate<Map<String, Object>>() {
            public boolean test(Map<String, Object> row) {
                Object v = row.get(field);
                if (v == null) return false;
                boolean found = false;
                for (Object candidate : values) {
                    if (valueEquals(v, candidate)) { found = true; break; }
                }
                return found == shouldContain;
            }
        };
    }

    /** Numeric-aware equality: Integer 5 equals Long 5 equals Double 5.0. */
    static boolean valueEquals(Object a, Object b) {
        if (a instanceof Number && b instanceof Number) {
            return Double.compare(((Number) a).doubleValue(), ((Number) b).doubleValue()) == 0;
        }
        return Objects.equals(a, b);
    }

    /** Ordering across mixed types; null result = incomparable (treated as no-match). */
    @SuppressWarnings({"unchecked", "rawtypes"})
    static Integer compareValues(Object a, Object b) {
        if (a == null || b == null) return null;
        if (a instanceof Number && b instanceof Number) {
            return Double.compare(((Number) a).doubleValue(), ((Number) b).doubleValue());
        }
        if (a instanceof Comparable && a.getClass() == b.getClass()) {
            return ((Comparable) a).compareTo(b);
        }
        return null;
    }
}
