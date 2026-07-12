package com.you.lld.problems.querydsl;

import com.you.lld.problems.querydsl.api.QueryError;
import com.you.lld.problems.querydsl.api.QueryRequest;
import com.you.lld.problems.querydsl.api.QueryResponse;
import com.you.lld.problems.querydsl.model.Comparison;
import com.you.lld.problems.querydsl.model.InvalidQueryException;
import com.you.lld.problems.querydsl.model.Operator;
import com.you.lld.problems.querydsl.model.Query;
import com.you.lld.problems.querydsl.model.SortSpec;
import com.you.lld.problems.querydsl.model.TableSchema;
import com.you.lld.problems.querydsl.service.impl.SqlStatement;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
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
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class QueryDslTest {

    private QueryEngine engine;

    @BeforeEach
    void setUp() {
        engine = new QueryEngine();
        TableSchema schema = TableSchema.table("users")
            .field("id", TableSchema.FieldType.STRING)
            .field("name", TableSchema.FieldType.STRING)
            .field("dept", TableSchema.FieldType.STRING)
            .field("age", TableSchema.FieldType.NUMBER)
            .field("manager", TableSchema.FieldType.STRING)
            .build();
        List<Map<String, Object>> rows = new ArrayList<Map<String, Object>>();
        rows.add(user("u1", "alice", "eng", 34, "carol"));
        rows.add(user("u2", "bob", "eng", 28, "carol"));
        rows.add(user("u3", "carol", "eng", 41, null));
        rows.add(user("u4", "dave", "sales", 35, "erin"));
        rows.add(user("u5", "erin", "sales", 45, null));
        engine.registerTable(schema, rows);
    }

    // ── construction / arity ────────────────────────────────────────────────

    @Test
    void operatorArityIsEnforcedAtConstruction() {
        assertThrows(InvalidQueryException.class, () ->
            new Comparison("age", Operator.BETWEEN, Collections.<Object>singletonList(5)));
        assertThrows(InvalidQueryException.class, () ->
            new Comparison("age", Operator.EQ, Arrays.<Object>asList(1, 2)));
        assertThrows(InvalidQueryException.class, () ->
            new Comparison("age", Operator.IS_NULL, Collections.<Object>singletonList(1)));
    }

    @Test
    void pageBoundsAreEnforced() {
        assertThrows(InvalidQueryException.class,
            () -> Query.from("users").page(0, 0).build());
        assertThrows(InvalidQueryException.class,
            () -> Query.from("users").page(5000, 0).build());
    }

    // ── SQL translation ─────────────────────────────────────────────────────

    @Test
    void sqlTranslationIsParameterizedInPlaceholderOrder() {
        Query q = Query.from("users")
            .select("id", "name")
            .where(and(eq("dept", "eng"), or(gt("age", 30), in("name", "bob", "dave"))))
            .orderBy("age", SortSpec.Direction.DESC)
            .page(10, 20)
            .build();
        SqlStatement stmt = engine.toSql(q);

        assertEquals("SELECT id, name FROM users"
            + " WHERE (dept = ? AND (age > ? OR name IN (?, ?)))"
            + " ORDER BY age DESC LIMIT ? OFFSET ?", stmt.sql());
        assertEquals(Arrays.<Object>asList("eng", 30, "bob", "dave", 10, 20L), stmt.params());
    }

    @Test
    void sqlInjectionValueNeverEntersSqlString() {
        String malicious = "x'; DROP TABLE users; --";
        SqlStatement stmt = engine.toSql(
            Query.from("users").where(eq("name", malicious)).build());
        assertFalse(stmt.sql().contains("DROP"), "value must not leak into SQL text");
        assertTrue(stmt.params().contains(malicious), "value must be a bind parameter");
    }

    @Test
    void sqlRejectsMaliciousIdentifiers() {
        assertThrows(InvalidQueryException.class, () ->
            engine.toSql(Query.from("users; DROP TABLE users").build()));
        assertThrows(InvalidQueryException.class, () ->
            engine.toSql(Query.from("users").where(eq("name = '' OR 1", "x")).build()));
    }

    // ── in-memory execution semantics ───────────────────────────────────────

    @Test
    void nestedBooleanLogicFiltersCorrectly() {
        Query q = Query.from("users")
            .select("id")
            .where(and(eq("dept", "eng"), or(gt("age", 40), eq("name", "bob"))))
            .build();
        assertEquals(Arrays.asList("u2", "u3"), ids(engine.execute(QueryRequest.of("r", q))));
    }

    @Test
    void betweenIsInclusiveOnBothEnds() {
        Query q = Query.from("users").select("id")
            .where(between("age", 28, 35)).build();
        assertEquals(Arrays.asList("u1", "u2", "u4"), ids(engine.execute(QueryRequest.of("r", q))));
    }

    @Test
    void numericEqualityWorksAcrossBoxedTypes() {
        Query q = Query.from("users").select("id").where(eq("age", 34L)).build(); // Long vs Integer
        assertEquals(Collections.singletonList("u1"), ids(engine.execute(QueryRequest.of("r", q))));
    }

    @Test
    void isNullAndNotCompose() {
        Query nulls = Query.from("users").select("id").where(isNull("manager")).build();
        assertEquals(Arrays.asList("u3", "u5"), ids(engine.execute(QueryRequest.of("r", nulls))));

        Query notNulls = Query.from("users").select("id").where(not(isNull("manager"))).build();
        assertEquals(Arrays.asList("u1", "u2", "u4"), ids(engine.execute(QueryRequest.of("r", notNulls))));
    }

    @Test
    void multiKeySortAndPaginationSliceWithHasMore() {
        Query q = Query.from("users").select("id")
            .orderBy("dept", SortSpec.Direction.ASC)
            .orderBy("age", SortSpec.Direction.DESC)
            .page(3, 0)
            .build();
        QueryResponse first = engine.execute(QueryRequest.of("r", q));
        assertEquals(Arrays.asList("u3", "u1", "u2"), ids(first)); // eng by age desc
        assertEquals(5, first.totalCount());
        assertTrue(first.hasMore());

        Query next = Query.from("users").select("id")
            .orderBy("dept", SortSpec.Direction.ASC)
            .orderBy("age", SortSpec.Direction.DESC)
            .page(3, 3)
            .build();
        QueryResponse second = engine.execute(QueryRequest.of("r", next));
        assertEquals(Arrays.asList("u5", "u4"), ids(second));      // sales by age desc
        assertFalse(second.hasMore());
    }

    @Test
    void projectionReturnsOnlySelectedFields() {
        Query q = Query.from("users").select("name", "dept")
            .where(eq("id", "u1")).build();
        Map<String, Object> row = engine.execute(QueryRequest.of("r", q)).rows().get(0);
        assertEquals(2, row.size());
        assertTrue(row.containsKey("name") && row.containsKey("dept"));
    }

    // ── semantic validation ─────────────────────────────────────────────────

    @Test
    void unknownFieldAndIncompatibleOperatorReportedTogether() {
        Query bad = Query.from("users")
            .where(and(eq("nonexistent", 1), contains("age", "3")))
            .build();
        QueryResponse resp = engine.execute(QueryRequest.of("r", bad));
        assertEquals(QueryResponse.Status.INVALID_QUERY, resp.status());
        assertEquals(2, resp.errors().size());
        assertEquals(QueryError.Code.UNKNOWN_FIELD, resp.errors().get(0).code());
        assertEquals(QueryError.Code.INCOMPATIBLE_OPERATOR, resp.errors().get(1).code());
    }

    @Test
    void unknownSourceIsAnErrorResponseNotAnException() {
        QueryResponse resp = engine.execute(
            QueryRequest.of("r", Query.from("nope").build()));
        assertEquals(QueryResponse.Status.INVALID_QUERY, resp.status());
        assertEquals(QueryError.Code.UNKNOWN_SOURCE, resp.errors().get(0).code());
    }

    // ── second backend ──────────────────────────────────────────────────────

    @Test
    void mongoTranslationRendersSameAst() {
        Query q = Query.from("users")
            .where(and(eq("dept", "eng"), gt("age", 30)))
            .orderBy("age", SortSpec.Direction.DESC)
            .page(10, 0)
            .build();
        String mongo = engine.toMongo(q);
        assertTrue(mongo.contains("db.users.find"));
        assertTrue(mongo.contains("\"$and\""));
        assertTrue(mongo.contains("\"$gt\": 30"));
        assertTrue(mongo.contains(".sort({\"age\": -1})"));
        assertTrue(mongo.endsWith(".skip(0).limit(10)"));
    }

    // ── helpers ─────────────────────────────────────────────────────────────

    private static List<String> ids(QueryResponse resp) {
        List<String> out = new ArrayList<String>();
        for (Map<String, Object> row : resp.rows()) out.add((String) row.get("id"));
        return out;
    }

    private static Map<String, Object> user(String id, String name, String dept,
                                            int age, String manager) {
        Map<String, Object> m = new LinkedHashMap<String, Object>();
        m.put("id", id);
        m.put("name", name);
        m.put("dept", dept);
        m.put("age", age);
        m.put("manager", manager);
        return m;
    }
}
