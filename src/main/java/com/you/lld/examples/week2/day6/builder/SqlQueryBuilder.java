package com.you.lld.examples.week2.day6.builder;

import java.util.ArrayList;
import java.util.List;
import java.util.StringJoiner;

/**
 * SQL Query Builder demonstrating the Builder pattern for dynamic query construction.
 * 
 * This example shows how Builder pattern can be used for:
 * - Dynamic SQL query construction
 * - Method chaining for readable code
 * - Conditional query building
 * - SQL injection prevention through parameterization
 */
public class SqlQueryBuilder {
    private final StringBuilder query;
    private final List<Object> parameters;
    private final QueryType queryType;
    
    private SqlQueryBuilder(QueryType queryType) {
        this.query = new StringBuilder();
        this.parameters = new ArrayList<>();
        this.queryType = queryType;
    }
    
    // Factory methods for different query types
    public static SqlQueryBuilder select() {
        return new SqlQueryBuilder(QueryType.SELECT);
    }
    
    public static SqlQueryBuilder insert() {
        return new SqlQueryBuilder(QueryType.INSERT);
    }
    
    public static SqlQueryBuilder update() {
        return new SqlQueryBuilder(QueryType.UPDATE);
    }
    
    public static SqlQueryBuilder delete() {
        return new SqlQueryBuilder(QueryType.DELETE);
    }
    
    // SELECT query methods
    public SqlQueryBuilder columns(String... columns) {
        if (queryType != QueryType.SELECT) {
            throw new IllegalStateException("columns() can only be used with SELECT queries");
        }
        
        if (columns.length == 0) {
            query.append("SELECT * ");
        } else {
            query.append("SELECT ");
            StringJoiner joiner = new StringJoiner(", ");
            for (String column : columns) {
                joiner.add(column);
            }
            query.append(joiner.toString()).append(" ");
        }
        return this;
    }
    
    public SqlQueryBuilder from(String table) {
        if (queryType == QueryType.SELECT) {
            query.append("FROM ").append(table).append(" ");
        } else if (queryType == QueryType.DELETE) {
            query.append("DELETE FROM ").append(table).append(" ");
        } else {
            throw new IllegalStateException("from() can only be used with SELECT or DELETE queries");
        }
        return this;
    }
    
    // INSERT query methods
    public SqlQueryBuilder into(String table) {
        if (queryType != QueryType.INSERT) {
            throw new IllegalStateException("into() can only be used with INSERT queries");
        }
        query.append("INSERT INTO ").append(table).append(" ");
        return this;
    }
    
    public SqlQueryBuilder values(String... columns) {
        if (queryType != QueryType.INSERT) {
            throw new IllegalStateException("values() can only be used with INSERT queries");
        }
        
        // Add column names
        query.append("(");
        StringJoiner columnJoiner = new StringJoiner(", ");
        for (String column : columns) {
            columnJoiner.add(column);
        }
        query.append(columnJoiner.toString()).append(") VALUES (");
        
        // Add parameter placeholders
        StringJoiner valueJoiner = new StringJoiner(", ");
        for (int i = 0; i < columns.length; i++) {
            valueJoiner.add("?");
        }
        query.append(valueJoiner.toString()).append(") ");
        
        return this;
    }
    
    // UPDATE query methods
    public SqlQueryBuilder table(String table) {
        if (queryType != QueryType.UPDATE) {
            throw new IllegalStateException("table() can only be used with UPDATE queries");
        }
        query.append("UPDATE ").append(table).append(" ");
        return this;
    }
    
    public SqlQueryBuilder set(String column) {
        if (queryType != QueryType.UPDATE) {
            throw new IllegalStateException("set() can only be used with UPDATE queries");
        }
        
        if (!query.toString().contains("SET")) {
            query.append("SET ");
        } else {
            query.append(", ");
        }
        
        query.append(column).append(" = ? ");
        return this;
    }
    
    // Common WHERE clause methods
    public SqlQueryBuilder where(String condition) {
        query.append("WHERE ").append(condition).append(" ");
        return this;
    }
    
    public SqlQueryBuilder and(String condition) {
        query.append("AND ").append(condition).append(" ");
        return this;
    }
    
    public SqlQueryBuilder or(String condition) {
        query.append("OR ").append(condition).append(" ");
        return this;
    }
    
    // Parameter binding methods
    public SqlQueryBuilder withParameter(Object parameter) {
        parameters.add(parameter);
        return this;
    }
    
    public SqlQueryBuilder withParameters(Object... params) {
        for (Object param : params) {
            parameters.add(param);
        }
        return this;
    }
    
    // JOIN methods for SELECT queries
    public SqlQueryBuilder innerJoin(String table, String condition) {
        if (queryType != QueryType.SELECT) {
            throw new IllegalStateException("JOIN can only be used with SELECT queries");
        }
        query.append("INNER JOIN ").append(table).append(" ON ").append(condition).append(" ");
        return this;
    }
    
    public SqlQueryBuilder leftJoin(String table, String condition) {
        if (queryType != QueryType.SELECT) {
            throw new IllegalStateException("JOIN can only be used with SELECT queries");
        }
        query.append("LEFT JOIN ").append(table).append(" ON ").append(condition).append(" ");
        return this;
    }
    
    // Ordering and grouping
    public SqlQueryBuilder orderBy(String column, SortOrder order) {
        if (queryType != QueryType.SELECT) {
            throw new IllegalStateException("ORDER BY can only be used with SELECT queries");
        }
        query.append("ORDER BY ").append(column).append(" ").append(order.name()).append(" ");
        return this;
    }
    
    public SqlQueryBuilder groupBy(String... columns) {
        if (queryType != QueryType.SELECT) {
            throw new IllegalStateException("GROUP BY can only be used with SELECT queries");
        }
        query.append("GROUP BY ");
        StringJoiner joiner = new StringJoiner(", ");
        for (String column : columns) {
            joiner.add(column);
        }
        query.append(joiner.toString()).append(" ");
        return this;
    }
    
    public SqlQueryBuilder having(String condition) {
        if (queryType != QueryType.SELECT) {
            throw new IllegalStateException("HAVING can only be used with SELECT queries");
        }
        query.append("HAVING ").append(condition).append(" ");
        return this;
    }
    
    public SqlQueryBuilder limit(int count) {
        if (queryType != QueryType.SELECT) {
            throw new IllegalStateException("LIMIT can only be used with SELECT queries");
        }
        query.append("LIMIT ").append(count).append(" ");
        return this;
    }
    
    // Build the final query
    public PreparedQuery build() {
        String finalQuery = query.toString().trim();
        if (finalQuery.isEmpty()) {
            throw new IllegalStateException("Query cannot be empty");
        }
        
        return new PreparedQuery(finalQuery, new ArrayList<>(parameters));
    }
    
    // Enums for type safety
    public enum QueryType {
        SELECT, INSERT, UPDATE, DELETE
    }
    
    public enum SortOrder {
        ASC, DESC
    }
    
    /**
     * Represents a prepared SQL query with parameters.
     * This is the immutable result of the builder.
     */
    public static class PreparedQuery {
        private final String sql;
        private final List<Object> parameters;
        
        public PreparedQuery(String sql, List<Object> parameters) {
            this.sql = sql;
            this.parameters = parameters;
        }
        
        public String getSql() {
            return sql;
        }
        
        public List<Object> getParameters() {
            return new ArrayList<>(parameters);
        }
        
        @Override
        public String toString() {
            return "PreparedQuery{" +
                   "sql='" + sql + '\'' +
                   ", parameters=" + parameters +
                   '}';
        }
    }
}
