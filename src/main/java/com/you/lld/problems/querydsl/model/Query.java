package com.you.lld.problems.querydsl.model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Immutable query AST — the single artifact every backend consumes.
 * <p>
 * Immutability is the concurrency story for the whole system: a Query can be shared
 * across threads, reused, logged, and used as a cache key with zero synchronization.
 * Built via the fluent {@link Builder} (the DSL surface).
 */
public final class Query {

    private final String source;                 // table / collection name
    private final List<String> select;           // empty = all fields
    private final Condition where;               // nullable = no filter
    private final List<SortSpec> sorts;
    private final Page page;

    private Query(Builder b) {
        this.source = b.source;
        this.select = Collections.unmodifiableList(new ArrayList<String>(b.select));
        this.where = b.where;
        this.sorts = Collections.unmodifiableList(new ArrayList<SortSpec>(b.sorts));
        this.page = (b.page == null) ? Page.defaultPage() : b.page;
    }

    public static Builder from(String source) {
        return new Builder(source);
    }

    public String source() {
        return source;
    }

    public List<String> select() {
        return select;
    }

    public Condition where() {
        return where;
    }

    public List<SortSpec> sorts() {
        return sorts;
    }

    public Page page() {
        return page;
    }

    public static final class Builder {
        private final String source;
        private final List<String> select = new ArrayList<String>();
        private Condition where;
        private final List<SortSpec> sorts = new ArrayList<SortSpec>();
        private Page page;

        private Builder(String source) {
            if (source == null || source.trim().isEmpty()) {
                throw new InvalidQueryException("query source (table) is required");
            }
            this.source = source;
        }

        public Builder select(String... fields) {
            this.select.addAll(Arrays.asList(fields));
            return this;
        }

        public Builder where(Condition condition) {
            this.where = condition;
            return this;
        }

        public Builder orderBy(String field, SortSpec.Direction direction) {
            this.sorts.add(new SortSpec(field, direction));
            return this;
        }

        public Builder page(int limit, long offset) {
            this.page = Page.of(limit, offset);
            return this;
        }

        public Builder limit(int limit) {
            this.page = Page.first(limit);
            return this;
        }

        public Query build() {
            return new Query(this);
        }
    }
}
