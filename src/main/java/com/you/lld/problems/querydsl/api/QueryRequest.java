package com.you.lld.problems.querydsl.api;

import com.you.lld.problems.querydsl.model.Query;

/**
 * Wire request envelope: the query itself plus execution options.
 * Maps 1:1 to the JSON contract (see README) — the JSON "filter" tree is exactly
 * the Condition AST, so deserialization is a direct recursive descent.
 */
public final class QueryRequest {

    private final String requestId;
    private final Query query;
    private final long timeoutMillis;
    private final boolean includeTotalCount;

    private QueryRequest(String requestId, Query query, long timeoutMillis, boolean includeTotalCount) {
        if (requestId == null || requestId.trim().isEmpty()) {
            throw new IllegalArgumentException("requestId is required");
        }
        if (query == null) {
            throw new IllegalArgumentException("query is required");
        }
        this.requestId = requestId;
        this.query = query;
        this.timeoutMillis = timeoutMillis;
        this.includeTotalCount = includeTotalCount;
    }

    public static QueryRequest of(String requestId, Query query) {
        return new QueryRequest(requestId, query, 5000L, true);
    }

    public static QueryRequest of(String requestId, Query query, long timeoutMillis, boolean includeTotalCount) {
        return new QueryRequest(requestId, query, timeoutMillis, includeTotalCount);
    }

    public String requestId() { return requestId; }
    public Query query() { return query; }
    public long timeoutMillis() { return timeoutMillis; }
    public boolean includeTotalCount() { return includeTotalCount; }
}
