package com.you.lld.problems.querydsl.api;

/** One machine-readable problem with a request. A response may carry several. */
public final class QueryError {

    public enum Code {
        UNKNOWN_SOURCE,          // table/collection not registered
        UNKNOWN_FIELD,           // filter/sort/projection references a field not in schema
        INCOMPATIBLE_OPERATOR,   // e.g. CONTAINS on a NUMBER field
        INVALID_QUERY,           // structural problem (arity, page bounds, ...)
        INTERNAL                 // executor blew up
    }

    private final Code code;
    private final String message;
    private final String field;   // nullable: which field caused it, when known

    public QueryError(Code code, String message, String field) {
        this.code = code;
        this.message = message;
        this.field = field;
    }

    public Code code() { return code; }
    public String message() { return message; }
    public String field() { return field; }

    @Override
    public String toString() {
        return code + (field != null ? "(" + field + ")" : "") + ": " + message;
    }
}
