package com.you.lld.problems.querydsl.service.impl;

import com.you.lld.problems.querydsl.model.Comparison;
import com.you.lld.problems.querydsl.model.InvalidQueryException;
import com.you.lld.problems.querydsl.model.LogicalCondition;
import com.you.lld.problems.querydsl.model.NotCondition;
import com.you.lld.problems.querydsl.model.Query;
import com.you.lld.problems.querydsl.model.SortSpec;
import com.you.lld.problems.querydsl.service.ConditionVisitor;
import com.you.lld.problems.querydsl.service.QueryTranslator;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

/**
 * AST -> parameterized SQL. The two injection defenses, explicitly:
 * 1. VALUES never enter the SQL string — they become '?' placeholders + a bind list.
 * 2. IDENTIFIERS (table/field names) can't be parameterized in SQL, so they are
 *    validated against a strict whitelist pattern instead.
 */
public final class SqlTranslator implements QueryTranslator<SqlStatement> {

    private static final Pattern IDENTIFIER = Pattern.compile("[A-Za-z_][A-Za-z0-9_]*");

    public SqlStatement translate(Query query) {
        requireIdentifier(query.source());
        for (String f : query.select()) requireIdentifier(f);
        for (SortSpec s : query.sorts()) requireIdentifier(s.field());

        List<Object> params = new ArrayList<Object>();
        StringBuilder sql = new StringBuilder("SELECT ");
        sql.append(query.select().isEmpty() ? "*" : join(query.select()));
        sql.append(" FROM ").append(query.source());

        if (query.where() != null) {
            sql.append(" WHERE ").append(query.where().accept(new Renderer(params)));
        }
        if (!query.sorts().isEmpty()) {
            List<String> keys = new ArrayList<String>();
            for (SortSpec s : query.sorts()) {
                keys.add(s.field() + (s.direction() == SortSpec.Direction.DESC ? " DESC" : " ASC"));
            }
            sql.append(" ORDER BY ").append(join(keys));
        }
        sql.append(" LIMIT ? OFFSET ?");
        params.add(query.page().limit());
        params.add(query.page().offset());

        return new SqlStatement(sql.toString(), params);
    }

    /** Renders one condition subtree; appends bind values in placeholder order. */
    private static final class Renderer implements ConditionVisitor<String> {
        private final List<Object> params;

        Renderer(List<Object> params) { this.params = params; }

        public String visitComparison(Comparison c) {
            requireIdentifier(c.field());
            switch (c.op()) {
                case EQ: case NEQ: case GT: case GTE: case LT: case LTE:
                    params.add(c.singleValue());
                    return c.field() + " " + c.op().symbol() + " ?";
                case IN: case NOT_IN: {
                    StringBuilder ph = new StringBuilder();
                    for (int i = 0; i < c.values().size(); i++) {
                        ph.append(i == 0 ? "?" : ", ?");
                        params.add(c.values().get(i));
                    }
                    return c.field() + " " + c.op().symbol() + " (" + ph + ")";
                }
                case CONTAINS:
                    params.add("%" + c.singleValue() + "%");
                    return c.field() + " LIKE ?";
                case STARTS_WITH:
                    params.add(c.singleValue() + "%");
                    return c.field() + " LIKE ?";
                case BETWEEN:
                    params.add(c.values().get(0));
                    params.add(c.values().get(1));
                    return c.field() + " BETWEEN ? AND ?";
                case IS_NULL:
                    return c.field() + " IS NULL";
                case IS_NOT_NULL:
                    return c.field() + " IS NOT NULL";
                default:
                    throw new InvalidQueryException("unsupported operator: " + c.op());
            }
        }

        public String visitLogical(LogicalCondition l) {
            String glue = (l.op() == LogicalCondition.Op.AND) ? " AND " : " OR ";
            List<String> parts = new ArrayList<String>();
            for (com.you.lld.problems.querydsl.model.Condition child : l.children()) {
                parts.add(child.accept(this));
            }
            return "(" + join(parts, glue) + ")";
        }

        public String visitNot(NotCondition n) {
            return "NOT (" + n.child().accept(this) + ")";
        }
    }

    private static void requireIdentifier(String name) {
        if (name == null || !IDENTIFIER.matcher(name).matches()) {
            throw new InvalidQueryException("illegal identifier: '" + name + "'");
        }
    }

    private static String join(List<String> parts) { return join(parts, ", "); }

    private static String join(List<String> parts, String glue) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < parts.size(); i++) {
            if (i > 0) sb.append(glue);
            sb.append(parts.get(i));
        }
        return sb.toString();
    }
}
