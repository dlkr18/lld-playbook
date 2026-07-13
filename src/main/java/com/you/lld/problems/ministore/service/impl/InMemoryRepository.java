package com.you.lld.problems.ministore.service.impl;

import com.you.lld.problems.ministore.service.Repository;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/** Trivial map-backed store. Swap for a JDBC/JPA impl without touching callers. */
public final class InMemoryRepository<T, ID> implements Repository<T, ID> {

    private final Map<ID, T> data = new LinkedHashMap<ID, T>();

    public void save(ID id, T entity) { data.put(id, entity); }
    public T findById(ID id) { return data.get(id); }
    public List<T> findAll() { return new ArrayList<T>(data.values()); }
    public void deleteById(ID id) { data.remove(id); }
}
