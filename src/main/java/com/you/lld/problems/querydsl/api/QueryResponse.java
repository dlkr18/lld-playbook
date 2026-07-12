package com.you.lld.problems.querydsl.api;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

/**
 * Wire response envelope. Design choices worth defending in the interview:
 * - status is an enum, not HTTP-only semantics — transport-agnostic.
 * - data and error are mutually exclusive; errors is a LIST (report all validation
 *   problems in one round-trip, not one per retry).
 * - totalCount is optional (-1 = not computed) because COUNT can be expensive.
 */
public final class QueryResponse {

    public enum Status { SUCCESS, INVALID_QUERY, ERROR }

    private final String requestId;
    private final Status status;
    private final List<Map<String, Object>> rows;
    private final long totalCount;               // -1 when not requested/unknown
    private final boolean hasMore;
    private final ExecutionStats stats;          // null on failure
    private final List<QueryError> errors;

    private QueryResponse(String requestId, Status status, List<Map<String, Object>> rows,
                          long totalCount, boolean hasMore, ExecutionStats stats,
                          List<QueryError> errors) {
        this.requestId = requestId;
        this.status = status;
        this.rows = Collections.unmodifiableList(new ArrayList<Map<String, Object>>(rows));
        this.totalCount = totalCount;
        this.hasMore = hasMore;
        this.stats = stats;
        this.errors = Collections.unmodifiableList(new ArrayList<QueryError>(errors));
    }

    public static QueryResponse success(String requestId, List<Map<String, Object>> rows,
                                        long totalCount, boolean hasMore, ExecutionStats stats) {
        return new QueryResponse(requestId, Status.SUCCESS, rows, totalCount, hasMore,
            stats, Collections.<QueryError>emptyList());
    }

    public static QueryResponse invalid(String requestId, List<QueryError> errors) {
        return new QueryResponse(requestId, Status.INVALID_QUERY,
            Collections.<Map<String, Object>>emptyList(), -1, false, null, errors);
    }

    public static QueryResponse error(String requestId, QueryError error) {
        return new QueryResponse(requestId, Status.ERROR,
            Collections.<Map<String, Object>>emptyList(), -1, false, null,
            Collections.singletonList(error));
    }

    public String requestId() { return requestId; }
    public Status status() { return status; }
    public List<Map<String, Object>> rows() { return rows; }
    public long totalCount() { return totalCount; }
    public boolean hasMore() { return hasMore; }
    public ExecutionStats stats() { return stats; }
    public List<QueryError> errors() { return errors; }

    /** Pretty JSON-ish rendering used by the demo to show the wire shape. */
    public String toPrettyString() {
        StringBuilder sb = new StringBuilder();
        sb.append("{\n");
        sb.append("  \"requestId\": \"").append(requestId).append("\",\n");
        sb.append("  \"status\": \"").append(status).append("\",\n");
        if (status == Status.SUCCESS) {
            sb.append("  \"data\": {\n");
            sb.append("    \"rows\": [\n");
            for (int i = 0; i < rows.size(); i++) {
                sb.append("      ").append(rows.get(i)).append(i < rows.size() - 1 ? "," : "").append("\n");
            }
            sb.append("    ],\n");
            sb.append("    \"returnedCount\": ").append(rows.size()).append(",\n");
            sb.append("    \"totalCount\": ").append(totalCount).append(",\n");
            sb.append("    \"hasMore\": ").append(hasMore).append("\n");
            sb.append("  },\n");
            sb.append("  \"stats\": { \"rowsScanned\": ").append(stats.rowsScanned())
              .append(", \"elapsedMicros\": ").append(stats.elapsedMicros()).append(" }\n");
        } else {
            sb.append("  \"errors\": [\n");
            for (int i = 0; i < errors.size(); i++) {
                QueryError e = errors.get(i);
                sb.append("    { \"code\": \"").append(e.code()).append("\", \"message\": \"")
                  .append(e.message()).append("\"")
                  .append(e.field() != null ? ", \"field\": \"" + e.field() + "\"" : "")
                  .append(" }").append(i < errors.size() - 1 ? "," : "").append("\n");
            }
            sb.append("  ]\n");
        }
        sb.append("}");
        return sb.toString();
    }
}
