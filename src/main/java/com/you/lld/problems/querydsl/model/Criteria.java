package com.you.lld.problems.querydsl.model;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Static factory entry point of the DSL — the vocabulary callers actually type:
 *
 *   where(and(eq("status", "FAILED"),
 *             or(in("env", "prod", "staging"), gt("durationMs", 30000))))
 */
public final class Criteria {

    private Criteria() {}

    public static Condition eq(String field, Object value)  { return cmp(field, Operator.EQ, value); }
    public static Condition neq(String field, Object value) { return cmp(field, Operator.NEQ, value); }
    public static Condition gt(String field, Object value)  { return cmp(field, Operator.GT, value); }
    public static Condition gte(String field, Object value) { return cmp(field, Operator.GTE, value); }
    public static Condition lt(String field, Object value)  { return cmp(field, Operator.LT, value); }
    public static Condition lte(String field, Object value) { return cmp(field, Operator.LTE, value); }

    public static Condition in(String field, Object... values) {
        return new Comparison(field, Operator.IN, Arrays.asList(values));
    }

    public static Condition notIn(String field, Object... values) {
        return new Comparison(field, Operator.NOT_IN, Arrays.asList(values));
    }

    public static Condition contains(String field, String value) {
        return cmp(field, Operator.CONTAINS, value);
    }

    public static Condition startsWith(String field, String value) {
        return cmp(field, Operator.STARTS_WITH, value);
    }

    public static Condition between(String field, Object low, Object high) {
        return new Comparison(field, Operator.BETWEEN, Arrays.asList(low, high));
    }

    public static Condition isNull(String field) {
        return new Comparison(field, Operator.IS_NULL, Collections.emptyList());
    }

    public static Condition isNotNull(String field) {
        return new Comparison(field, Operator.IS_NOT_NULL, Collections.emptyList());
    }

    public static Condition and(Condition... conditions) {
        return new LogicalCondition(LogicalCondition.Op.AND, Arrays.asList(conditions));
    }

    public static Condition or(Condition... conditions) {
        return new LogicalCondition(LogicalCondition.Op.OR, Arrays.asList(conditions));
    }

    public static Condition not(Condition condition) {
        return new NotCondition(condition);
    }

    private static Condition cmp(String field, Operator op, Object value) {
        return new Comparison(field, op, Collections.singletonList(value));
    }
}
