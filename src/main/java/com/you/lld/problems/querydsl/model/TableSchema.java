package com.you.lld.problems.querydsl.model;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Declared shape of a queryable source, used for semantic validation: unknown fields
 * and operator/type mismatches are caught before execution with a precise error,
 * instead of silently returning wrong results.
 */
public final class TableSchema {

    public enum FieldType { STRING, NUMBER, BOOLEAN }

    private final String name;
    private final Map<String, FieldType> fields;

    private TableSchema(String name, Map<String, FieldType> fields) {
        this.name = name;
        this.fields = Collections.unmodifiableMap(new LinkedHashMap<String, FieldType>(fields));
    }

    public static Builder table(String name) { return new Builder(name); }

    public String name() { return name; }
    public boolean hasField(String field) { return fields.containsKey(field); }
    public FieldType typeOf(String field) { return fields.get(field); }
    public Map<String, FieldType> fields() { return fields; }

    public static final class Builder {
        private final String name;
        private final Map<String, FieldType> fields = new LinkedHashMap<String, FieldType>();

        private Builder(String name) {
            if (name == null || name.trim().isEmpty()) {
                throw new InvalidQueryException("table name is required");
            }
            this.name = name;
        }

        public Builder field(String field, FieldType type) {
            fields.put(field, type);
            return this;
        }

        public TableSchema build() { return new TableSchema(name, fields); }
    }
}
