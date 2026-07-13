package com.you.lld.problems.ministore.service;

import java.util.List;

/**
 * Storage abstraction. The whole platform talks to this, never to a concrete map or DB.
 * v1 ships an in-memory implementation; swapping to JDBC/JPA later is a new impl with
 * zero changes to the services above it. (Directly answers the "in-memory OR relational,
 * don't worry about scale yet" requirement — the seam is here for when you do.)
 */
public interface Repository<T, ID> {
    void save(ID id, T entity);
    T findById(ID id);            // null when absent
    List<T> findAll();
    void deleteById(ID id);
}
