package com.you.lld.problems.querydsl.service.impl;

import com.you.lld.problems.querydsl.api.QueryError;
import com.you.lld.problems.querydsl.model.Comparison;
import com.you.lld.problems.querydsl.model.Condition;
import com.you.lld.problems.querydsl.model.LogicalCondition;
import com.you.lld.problems.querydsl.model.NotCondition;
import com.you.lld.problems.querydsl.model.Operator;
import com.you.lld.problems.querydsl.model.Query;
import com.you.lld.problems.querydsl.model.SortSpec;
import com.you.lld.problems.querydsl.model.TableSchema;
import com.you.lld.problems.querydsl.service.ConditionVisitor;

import java.util.ArrayList;
import java.util.List;

/**
 * Semantic (schema-aware) validation. Two layers of defense in this system:
 * - SYNTACTIC problems (operator arity, page bounds) fail fast at construction time.
 * - SEMANTIC problems (unknown field, operator/type mismatch) need the schema, so
 *   they are checked here at execution time — and ALL of them are reported at once.
 */
public final class QueryValidator {

    public List<QueryError> validate(Query query, TableSchema schema) {
        List<QueryError> errors = new ArrayList<QueryError>();

        for (String f : query.select()) requireField(schema, f, errors, "projection");
        for (SortSpec s : query.sorts()) requireField(schema, s.field(), errors, "sort");

        if (query.where() != null) {
            query.where().accept(new ConditionValidator(schema, errors));
        }
        return errors;
    }

    private static void requireField(TableSchema schema, String field,
                                     List<QueryError> errors, String where) {
        if (!schema.hasField(field)) {
            errors.add(new QueryError(QueryError.Code.UNKNOWN_FIELD,
                "unknown field in " + where + ": '" + field + "'", field));
        }
    }

    /** Walks the filter tree collecting every problem (does not stop at the first). */
    private static final class ConditionValidator implements ConditionVisitor<Void> {
        private final TableSchema schema;
        private final List<QueryError> errors;

        ConditionValidator(TableSchema schema, List<QueryError> errors) {
            this.schema = schema;
            this.errors = errors;
        }

        public Void visitComparison(Comparison c) {
            if (!schema.hasField(c.field())) {
                errors.add(new QueryError(QueryError.Code.UNKNOWN_FIELD,
                    "unknown field in filter: '" + c.field() + "'", c.field()));
                return null;
            }
            TableSchema.FieldType type = schema.typeOf(c.field());
            if (!compatible(c.op(), type)) {
                errors.add(new QueryError(QueryError.Code.INCOMPATIBLE_OPERATOR,
                    c.op() + " is not applicable to " + type + " field '" + c.field() + "'",
                    c.field()));
            }
            return null;
        }

        public Void visitLogical(LogicalCondition l) {
            for (Condition child : l.children()) child.accept(this);
            return null;
        }

        public Void visitNot(NotCondition n) {
            n.child().accept(this);
            return null;
        }

        private static boolean compatible(Operator op, TableSchema.FieldType type) {
            switch (op) {
                case CONTAINS:
                case STARTS_WITH:
                    return type == TableSchema.FieldType.STRING;
                case GT: case GTE: case LT: case LTE: case BETWEEN:
                    return type == TableSchema.FieldType.STRING
                        || type == TableSchema.FieldType.NUMBER;
                default:
                    return true;   // EQ/NEQ/IN/NOT_IN/IS_NULL/IS_NOT_NULL work on any type
            }
        }
    }
}
