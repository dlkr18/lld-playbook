package com.you.lld.problems.querydsl.service.impl;

import com.you.lld.problems.querydsl.api.ExecutionStats;
import com.you.lld.problems.querydsl.api.QueryError;
import com.you.lld.problems.querydsl.api.QueryRequest;
import com.you.lld.problems.querydsl.api.QueryResponse;
import com.you.lld.problems.querydsl.model.Query;
import com.you.lld.problems.querydsl.model.SortSpec;
import com.you.lld.problems.querydsl.model.TableSchema;
import com.you.lld.problems.querydsl.service.QueryService;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.function.Predicate;

/**
 * Reference backend: interprets the Query AST over in-memory tables.
 * Pipeline per request: resolve source -> validate against schema -> filter
 * (Predicate from the AST) -> sort -> count -> paginate -> project.
 *
 * Thread-safety: queries are immutable and this service is stateless per request;
 * the table registry is a ConcurrentHashMap and table contents are defensively
 * copied at registration — so concurrent execute() calls need no locking.
 */
public final class InMemoryQueryService implements QueryService {

    private static final class Table {
        final TableSchema schema;
        final List<Map<String, Object>> rows;
        Table(TableSchema schema, List<Map<String, Object>> rows) {
            this.schema = schema;
            this.rows = rows;
        }
    }

    private final Map<String, Table> tables = new ConcurrentHashMap<String, Table>();
    private final QueryValidator validator = new QueryValidator();

    public void registerTable(TableSchema schema, List<Map<String, Object>> rows) {
        List<Map<String, Object>> copy = new ArrayList<Map<String, Object>>();
        for (Map<String, Object> row : rows) {
            copy.add(Collections.unmodifiableMap(new LinkedHashMap<String, Object>(row)));
        }
        tables.put(schema.name(), new Table(schema, Collections.unmodifiableList(copy)));
    }

    public QueryResponse execute(QueryRequest request) {
        long start = System.nanoTime();
        Query query = request.query();

        Table table = tables.get(query.source());
        if (table == null) {
            return QueryResponse.invalid(request.requestId(), Collections.singletonList(
                new QueryError(QueryError.Code.UNKNOWN_SOURCE,
                    "unknown source: '" + query.source() + "'", null)));
        }

        List<QueryError> errors = validator.validate(query, table.schema);
        if (!errors.isEmpty()) {
            return QueryResponse.invalid(request.requestId(), errors);
        }

        // filter
        List<Map<String, Object>> matched;
        if (query.where() == null) {
            matched = new ArrayList<Map<String, Object>>(table.rows);
        } else {
            Predicate<Map<String, Object>> predicate = query.where().accept(new PredicateBuilder());
            matched = new ArrayList<Map<String, Object>>();
            for (Map<String, Object> row : table.rows) {
                if (predicate.test(row)) matched.add(row);
            }
        }

        // sort
        Comparator<Map<String, Object>> comparator = buildComparator(query.sorts());
        if (comparator != null) Collections.sort(matched, comparator);

        // count + paginate
        long total = matched.size();
        int from = (int) Math.min(query.page().offset(), matched.size());
        int to = Math.min(from + query.page().limit(), matched.size());
        List<Map<String, Object>> pageRows = matched.subList(from, to);
        boolean hasMore = to < matched.size();

        // project
        List<Map<String, Object>> projected = project(pageRows, query.select());

        ExecutionStats stats = new ExecutionStats(
            table.rows.size(), (System.nanoTime() - start) / 1000);
        long totalOut = request.includeTotalCount() ? total : -1;
        return QueryResponse.success(request.requestId(), projected, totalOut, hasMore, stats);
    }

    private static Comparator<Map<String, Object>> buildComparator(List<SortSpec> sorts) {
        Comparator<Map<String, Object>> combined = null;
        for (final SortSpec sort : sorts) {
            Comparator<Map<String, Object>> c = new Comparator<Map<String, Object>>() {
                public int compare(Map<String, Object> a, Map<String, Object> b) {
                    Integer cmp = PredicateBuilder.compareValues(
                        a.get(sort.field()), b.get(sort.field()));
                    if (cmp != null) return cmp;
                    // nulls / incomparables last
                    Object av = a.get(sort.field());
                    Object bv = b.get(sort.field());
                    if (av == null && bv == null) return 0;
                    return (av == null) ? 1 : (bv == null ? -1 : 0);
                }
            };
            if (sort.direction() == SortSpec.Direction.DESC) c = Collections.reverseOrder(c);
            combined = (combined == null) ? c : thenComparing(combined, c);
        }
        return combined;
    }

    private static <T> Comparator<T> thenComparing(final Comparator<T> first, final Comparator<T> second) {
        return new Comparator<T>() {
            public int compare(T a, T b) {
                int r = first.compare(a, b);
                return (r != 0) ? r : second.compare(a, b);
            }
        };
    }

    private static List<Map<String, Object>> project(List<Map<String, Object>> rows,
                                                     List<String> select) {
        if (select.isEmpty()) return new ArrayList<Map<String, Object>>(rows);
        List<Map<String, Object>> out = new ArrayList<Map<String, Object>>();
        for (Map<String, Object> row : rows) {
            Map<String, Object> slim = new LinkedHashMap<String, Object>();
            for (String f : select) slim.put(f, row.get(f));
            out.add(slim);
        }
        return out;
    }
}
