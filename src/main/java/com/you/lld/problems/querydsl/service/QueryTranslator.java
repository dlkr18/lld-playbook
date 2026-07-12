package com.you.lld.problems.querydsl.service;

import com.you.lld.problems.querydsl.model.Query;

/**
 * Strategy: translate the backend-neutral Query AST into a backend-native form.
 * T is the native artifact (parameterized SQL, a Mongo filter document, ...).
 */
public interface QueryTranslator<T> {
    T translate(Query query);
}
