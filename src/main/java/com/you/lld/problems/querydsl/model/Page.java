package com.you.lld.problems.querydsl.model;

/**
 * Offset pagination with a server-side cap — an unbounded query is a denial-of-service
 * vector, so the cap lives in the model, not in caller goodwill.
 */
public final class Page {

    public static final int MAX_LIMIT = 1000;
    public static final int DEFAULT_LIMIT = 100;

    private final int limit;
    private final long offset;

    public Page(int limit, long offset) {
        if (limit < 1 || limit > MAX_LIMIT) {
            throw new InvalidQueryException("limit must be in [1, " + MAX_LIMIT + "], got " + limit);
        }
        if (offset < 0) {
            throw new InvalidQueryException("offset must be >= 0, got " + offset);
        }
        this.limit = limit;
        this.offset = offset;
    }

    public static Page of(int limit, long offset) { return new Page(limit, offset); }
    public static Page first(int limit) { return new Page(limit, 0); }
    public static Page defaultPage() { return new Page(DEFAULT_LIMIT, 0); }

    public int limit() { return limit; }
    public long offset() { return offset; }
}
