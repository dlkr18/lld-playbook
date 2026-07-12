package com.you.lld.problems.querydsl.service.impl;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * A parameterized SQL statement: template with '?' placeholders + bind values in order.
 * Values NEVER appear in the SQL string — that separation is the injection defense.
 */
public final class SqlStatement {

    private final String sql;
    private final List<Object> params;

    public SqlStatement(String sql, List<Object> params) {
        this.sql = sql;
        this.params = Collections.unmodifiableList(new ArrayList<Object>(params));
    }

    public String sql() { return sql; }
    public List<Object> params() { return params; }

    @Override
    public String toString() {
        return sql + "  -- params: " + params;
    }
}
