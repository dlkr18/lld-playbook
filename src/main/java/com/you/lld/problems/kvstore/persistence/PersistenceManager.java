package com.you.lld.problems.kvstore.persistence;

import java.util.Map;

public interface PersistenceManager {
    void save(Map<String, String> data);
    Map<String, String> load();
}
