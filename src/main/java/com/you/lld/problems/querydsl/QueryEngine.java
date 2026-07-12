package com.you.lld.problems.querydsl;

import com.you.lld.problems.querydsl.api.QueryRequest;
import com.you.lld.problems.querydsl.api.QueryResponse;
import com.you.lld.problems.querydsl.model.Query;
import com.you.lld.problems.querydsl.model.TableSchema;
import com.you.lld.problems.querydsl.service.QueryService;
import com.you.lld.problems.querydsl.service.impl.InMemoryQueryService;
import com.you.lld.problems.querydsl.service.impl.MongoTranslator;
import com.you.lld.problems.querydsl.service.impl.SqlStatement;
import com.you.lld.problems.querydsl.service.impl.SqlTranslator;

import java.util.List;
import java.util.Map;

/**
 * Facade — the class an interviewer reads first. One entry point that exposes the
 * three capabilities of the system:
 *   1. register sources (schema + data for the in-memory backend)
 *   2. execute a QueryRequest -> QueryResponse (the service API)
 *   3. translate the same Query to backend-native forms (SQL / Mongo)
 */
public final class QueryEngine {

    private final InMemoryQueryService inMemory = new InMemoryQueryService();
    private final SqlTranslator sql = new SqlTranslator();
    private final MongoTranslator mongo = new MongoTranslator();

    public void registerTable(TableSchema schema, List<Map<String, Object>> rows) {
        inMemory.registerTable(schema, rows);
    }

    public QueryResponse execute(QueryRequest request) {
        return inMemory.execute(request);
    }

    public SqlStatement toSql(Query query) {
        return sql.translate(query);
    }

    public String toMongo(Query query) {
        return mongo.translate(query);
    }

    /** The in-memory service behind the QueryService interface, for DI-style use. */
    public QueryService service() {
        return inMemory;
    }
}
