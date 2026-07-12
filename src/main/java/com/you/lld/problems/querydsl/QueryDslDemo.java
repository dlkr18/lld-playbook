package com.you.lld.problems.querydsl;

import com.you.lld.problems.querydsl.api.QueryRequest;
import com.you.lld.problems.querydsl.api.QueryResponse;
import com.you.lld.problems.querydsl.model.InvalidQueryException;
import com.you.lld.problems.querydsl.model.Page;
import com.you.lld.problems.querydsl.model.Query;
import com.you.lld.problems.querydsl.model.SortSpec;
import com.you.lld.problems.querydsl.model.TableSchema;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static com.you.lld.problems.querydsl.model.Criteria.and;
import static com.you.lld.problems.querydsl.model.Criteria.between;
import static com.you.lld.problems.querydsl.model.Criteria.contains;
import static com.you.lld.problems.querydsl.model.Criteria.eq;
import static com.you.lld.problems.querydsl.model.Criteria.gt;
import static com.you.lld.problems.querydsl.model.Criteria.in;
import static com.you.lld.problems.querydsl.model.Criteria.isNull;
import static com.you.lld.problems.querydsl.model.Criteria.not;
import static com.you.lld.problems.querydsl.model.Criteria.or;

/**
 * End-to-end demo of the query abstraction DSL:
 *   1. Fluent builder -> immutable AST -> parameterized SQL
 *   2. Same AST executed by the in-memory backend (request/response envelope)
 *   3. Nested boolean logic + operator showcase (IN / BETWEEN / CONTAINS / IS_NULL / NOT)
 *   4. Multi-key sort + pagination (totalCount, hasMore)
 *   5. Validation: build-time arity failure + schema-aware semantic errors
 *   6. SQL-injection attempt neutralized by parameter binding
 *   7. Same AST -> Mongo rendering (Open/Closed: new backend, zero model changes)
 */
public class QueryDslDemo {

    public static void main(String[] args) {
        QueryEngine engine = new QueryEngine();
        engine.registerTable(deploymentsSchema(), deploymentRows());

        header("1. Fluent DSL -> AST -> parameterized SQL");
        Query failedProd = Query.from("deployments")
            .select("id", "service", "env", "durationMs")
            .where(and(
                eq("status", "FAILED"),
                or(in("env", "prod", "staging"), gt("durationMs", 30000))))
            .orderBy("durationMs", SortSpec.Direction.DESC)
            .page(5, 0)
            .build();
        System.out.println("   " + engine.toSql(failedProd));

        header("2. Execute via the service API (request/response envelope)");
        QueryResponse response = engine.execute(QueryRequest.of("req-001", failedProd));
        System.out.println(indent(response.toPrettyString()));

        header("3. Operator showcase: BETWEEN + CONTAINS + IS_NULL + NOT");
        Query showcase = Query.from("deployments")
            .select("id", "service", "durationMs", "triggeredBy")
            .where(and(
                between("durationMs", 10000, 60000),
                contains("service", "pipe"),
                not(isNull("triggeredBy"))))
            .build();
        System.out.println("   SQL: " + engine.toSql(showcase).sql());
        QueryResponse r3 = engine.execute(QueryRequest.of("req-002", showcase));
        for (Map<String, Object> row : r3.rows()) System.out.println("   " + row);

        header("4. Multi-key sort + pagination");
        Query sorted = Query.from("deployments")
            .select("id", "env", "durationMs")
            .orderBy("env", SortSpec.Direction.ASC)
            .orderBy("durationMs", SortSpec.Direction.DESC)
            .page(4, 0)
            .build();
        QueryResponse page1 = engine.execute(QueryRequest.of("req-003", sorted));
        System.out.println("   page 1 (totalCount=" + page1.totalCount()
            + ", hasMore=" + page1.hasMore() + "):");
        for (Map<String, Object> row : page1.rows()) System.out.println("     " + row);

        Query pageTwo = Query.from("deployments")
            .select("id", "env", "durationMs")
            .orderBy("env", SortSpec.Direction.ASC)
            .orderBy("durationMs", SortSpec.Direction.DESC)
            .page(4, 4)
            .build();
        QueryResponse page2 = engine.execute(QueryRequest.of("req-004", pageTwo));
        System.out.println("   page 2 (hasMore=" + page2.hasMore() + "):");
        for (Map<String, Object> row : page2.rows()) System.out.println("     " + row);

        header("5. Validation — fail fast + fail informative");
        try {
            // As a JSON deserializer would build it: BETWEEN with one value.
            // (The fluent between(f, lo, hi) makes this unrepresentable at compile time.)
            new com.you.lld.problems.querydsl.model.Comparison(
                "durationMs", com.you.lld.problems.querydsl.model.Operator.BETWEEN,
                java.util.Collections.<Object>singletonList(5));
        } catch (InvalidQueryException e) {
            System.out.println("   build-time:  " + e.getMessage());
        }
        Query bad = Query.from("deployments")
            .select("id", "sevice")                     // typo field
            .where(and(contains("durationMs", "3"),     // CONTAINS on NUMBER
                       eq("regoin", "us-east")))        // unknown field
            .build();
        QueryResponse invalid = engine.execute(QueryRequest.of("req-005", bad));
        System.out.println("   execution-time (" + invalid.status() + "), all errors at once:");
        System.out.println(indent(invalid.toPrettyString()));

        header("6. Injection attempt is just data");
        Query sneaky = Query.from("deployments")
            .where(eq("service", "x' OR '1'='1")).build();
        System.out.println("   " + engine.toSql(sneaky));
        System.out.println("   -> malicious text never enters the SQL string; it is bind-value #1");
        QueryResponse r6 = engine.execute(QueryRequest.of("req-006", sneaky));
        System.out.println("   in-memory matches: " + r6.rows().size() + " (nothing — treated literally)");

        header("7. Same AST, second backend (Open/Closed proof)");
        System.out.println("   " + engine.toMongo(failedProd));

        System.out.println("\n=== demo complete ===");
    }

    // ── fixture ─────────────────────────────────────────────────────────────────

    private static TableSchema deploymentsSchema() {
        return TableSchema.table("deployments")
            .field("id", TableSchema.FieldType.STRING)
            .field("service", TableSchema.FieldType.STRING)
            .field("env", TableSchema.FieldType.STRING)
            .field("status", TableSchema.FieldType.STRING)
            .field("durationMs", TableSchema.FieldType.NUMBER)
            .field("triggeredBy", TableSchema.FieldType.STRING)
            .build();
    }

    private static List<Map<String, Object>> deploymentRows() {
        List<Map<String, Object>> rows = new ArrayList<Map<String, Object>>();
        rows.add(row("d1", "gateway",      "prod",    "SUCCESS", 12000, "alice"));
        rows.add(row("d2", "pipeline-svc", "prod",    "FAILED",  45000, "bob"));
        rows.add(row("d3", "ui",           "staging", "FAILED",  8000,  "carol"));
        rows.add(row("d4", "pipeline-svc", "staging", "SUCCESS", 30000, "alice"));
        rows.add(row("d5", "auth",         "prod",    "FAILED",  52000, null));
        rows.add(row("d6", "gateway",      "dev",     "FAILED",  61000, "dave"));
        rows.add(row("d7", "ui",           "prod",    "SUCCESS", 15000, "erin"));
        rows.add(row("d8", "pipeline-svc", "dev",     "SUCCESS", 22000, "bob"));
        rows.add(row("d9", "auth",         "staging", "RUNNING", 5000,  "carol"));
        rows.add(row("d10", "gateway",     "prod",    "FAILED",  33000, "alice"));
        return rows;
    }

    private static Map<String, Object> row(String id, String service, String env,
                                           String status, int durationMs, String triggeredBy) {
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        m.put("id", id);
        m.put("service", service);
        m.put("env", env);
        m.put("status", status);
        m.put("durationMs", durationMs);
        m.put("triggeredBy", triggeredBy);
        return m;
    }

    private static void header(String title) {
        System.out.println();
        System.out.println("── " + title + " ──");
    }

    private static String indent(String block) {
        StringBuilder sb = new StringBuilder();
        for (String line : block.split("\n")) sb.append("   ").append(line).append("\n");
        return sb.substring(0, sb.length() - 1);
    }
}
