package com.you.lld.problems.querydsl.service;

import com.you.lld.problems.querydsl.api.QueryRequest;
import com.you.lld.problems.querydsl.api.QueryResponse;

/**
 * The API-facing contract: execute a request, always return a well-formed response
 * (validation failures are responses, not exceptions — callers over the wire cannot
 * catch Java exceptions).
 */
public interface QueryService {
    QueryResponse execute(QueryRequest request);
}
