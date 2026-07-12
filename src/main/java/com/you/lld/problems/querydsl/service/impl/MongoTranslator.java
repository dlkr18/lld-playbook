package com.you.lld.problems.querydsl.service.impl;

import com.you.lld.problems.querydsl.model.Comparison;
import com.you.lld.problems.querydsl.model.Condition;
import com.you.lld.problems.querydsl.model.InvalidQueryException;
import com.you.lld.problems.querydsl.model.LogicalCondition;
import com.you.lld.problems.querydsl.model.NotCondition;
import com.you.lld.problems.querydsl.model.Query;
import com.you.lld.problems.querydsl.model.SortSpec;
import com.you.lld.problems.querydsl.service.ConditionVisitor;
import com.you.lld.problems.querydsl.service.QueryTranslator;

import java.util.ArrayList;
import java.util.List;

/**
 * AST -> Mongo-style find command (illustrative shape, not a driver). Exists to prove
 * the Open/Closed claim: a whole new backend is ONE new visitor — zero model changes.
 */
public final class MongoTranslator implements QueryTranslator<String> {

    public String translate(Query query) {
        StringBuilder out = new StringBuilder();
        out.append("db.").append(query.source()).append(".find(");
        out.append(query.where() == null ? "{}" : query.where().accept(new Renderer()));

        if (!query.select().isEmpty()) {
            List<String> proj = new ArrayList<String>();
            for (String f : query.select()) proj.add(quote(f) + ": 1");
            out.append(", {").append(join(proj)).append("}");
        }
        out.append(")");

        if (!query.sorts().isEmpty()) {
            List<String> keys = new ArrayList<String>();
            for (SortSpec s : query.sorts()) {
                keys.add(quote(s.field()) + ": " + (s.direction() == SortSpec.Direction.DESC ? -1 : 1));
            }
            out.append(".sort({").append(join(keys)).append("})");
        }
        out.append(".skip(").append(query.page().offset()).append(")");
        out.append(".limit(").append(query.page().limit()).append(")");
        return out.toString();
    }

    private static final class Renderer implements ConditionVisitor<String> {

        public String visitComparison(Comparison c) {
            switch (c.op()) {
                case EQ:  return doc(c.field(), "$eq", json(c.singleValue()));
                case NEQ: return doc(c.field(), "$ne", json(c.singleValue()));
                case GT:  return doc(c.field(), "$gt", json(c.singleValue()));
                case GTE: return doc(c.field(), "$gte", json(c.singleValue()));
                case LT:  return doc(c.field(), "$lt", json(c.singleValue()));
                case LTE: return doc(c.field(), "$lte", json(c.singleValue()));
                case IN:     return doc(c.field(), "$in", jsonArray(c.values()));
                case NOT_IN: return doc(c.field(), "$nin", jsonArray(c.values()));
                case CONTAINS:    return doc(c.field(), "$regex", json(String.valueOf(c.singleValue())));
                case STARTS_WITH: return doc(c.field(), "$regex", json("^" + c.singleValue()));
                case BETWEEN:
                    return "{" + quote(c.field()) + ": {\"$gte\": " + json(c.values().get(0))
                        + ", \"$lte\": " + json(c.values().get(1)) + "}}";
                case IS_NULL:     return doc(c.field(), "$eq", "null");
                case IS_NOT_NULL: return doc(c.field(), "$ne", "null");
                default: throw new InvalidQueryException("unsupported operator: " + c.op());
            }
        }

        public String visitLogical(LogicalCondition l) {
            String op = (l.op() == LogicalCondition.Op.AND) ? "$and" : "$or";
            List<String> parts = new ArrayList<String>();
            for (Condition child : l.children()) parts.add(child.accept(this));
            return "{\"" + op + "\": [" + join(parts) + "]}";
        }

        public String visitNot(NotCondition n) {
            return "{\"$not\": " + n.child().accept(this) + "}";
        }

        private static String doc(String field, String op, String value) {
            return "{" + quote(field) + ": {\"" + op + "\": " + value + "}}";
        }
    }

    private static String quote(String s) {
        return "\"" + s.replace("\\", "\\\\").replace("\"", "\\\"") + "\"";
    }

    private static String json(Object v) {
        if (v == null) return "null";
        if (v instanceof Number || v instanceof Boolean) return String.valueOf(v);
        return quote(String.valueOf(v));
    }

    private static String jsonArray(List<Object> values) {
        List<String> parts = new ArrayList<String>();
        for (Object v : values) parts.add(json(v));
        return "[" + join(parts) + "]";
    }

    private static String join(List<String> parts) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < parts.size(); i++) {
            if (i > 0) sb.append(", ");
            sb.append(parts.get(i));
        }
        return sb.toString();
    }
}
