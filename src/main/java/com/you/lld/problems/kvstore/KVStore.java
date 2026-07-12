package com.you.lld.problems.kvstore;

import com.you.lld.problems.kvstore.service.KVStoreService;
import com.you.lld.problems.kvstore.service.impl.InMemoryKVStore;

/**
 * Facade for the key-value store.
 */
public final class KVStore {

    private final KVStoreService service;

    public KVStore() {
        this(new InMemoryKVStore());
    }

    public KVStore(int maxEntries) {
        this(new InMemoryKVStore(maxEntries));
    }

    public KVStore(KVStoreService service) {
        this.service = service;
    }

    public KVStoreService service() {
        return service;
    }
}
