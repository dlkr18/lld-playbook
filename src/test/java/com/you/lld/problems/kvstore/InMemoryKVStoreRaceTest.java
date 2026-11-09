package com.you.lld.problems.kvstore;

import com.you.lld.problems.kvstore.model.KeyValue;
import com.you.lld.problems.kvstore.service.impl.InMemoryKVStore;
import org.junit.jupiter.api.Test;

import java.lang.reflect.Field;
import java.util.Map;
import java.util.concurrent.locks.ReentrantReadWriteLock;

import static org.junit.jupiter.api.Assertions.*;

class InMemoryKVStoreRaceTest {

    @Test
    void getDoesNotDeleteAPutThatLandsWhileItWaitsForTheWriteLock() throws Exception {
        InMemoryKVStore kv = new InMemoryKVStore();
        try {
            kv.put("k", "old", 0);
            Thread.sleep(20); // "old" is now expired

            ReentrantReadWriteLock lock = field(kv, "storeLock");
            Map<String, KeyValue> store = field(kv, "store");

            // Hold a read lock so get()'s upgrade to the write lock has to wait.
            lock.readLock().lock();
            Thread reader = new Thread(() -> kv.get("k"));
            reader.start();
            long deadline = System.currentTimeMillis() + 2000;
            while (!lock.hasQueuedThread(reader)) {
                assertTrue(System.currentTimeMillis() < deadline, "reader never queued for the write lock");
                Thread.sleep(1);
            }
            // A put that landed between get()'s read-unlock and write-lock.
            store.put("k", new KeyValue("k", "fresh"));
            lock.readLock().unlock();
            reader.join(2000);

            assertEquals("fresh", kv.get("k"));
        } finally {
            kv.shutdown();
        }
    }

    @SuppressWarnings("unchecked")
    private static <T> T field(Object target, String name) throws Exception {
        Field f = target.getClass().getDeclaredField(name);
        f.setAccessible(true);
        return (T) f.get(target);
    }
}
