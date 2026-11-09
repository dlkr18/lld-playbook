package com.you.lld.problems.lrucache;

import com.you.lld.problems.lrucache.api.CacheEventListener;
import com.you.lld.problems.lrucache.impl.ConcurrentCache;
import com.you.lld.problems.lrucache.impl.LRUCache;
import org.junit.jupiter.api.Test;

import java.util.concurrent.CountDownLatch;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

import static org.junit.jupiter.api.Assertions.*;

class ConcurrentCacheListenerTest {

    @Test
    void addingAListenerDuringAPutDoesNotBreakTheEventLoop() throws Exception {
        final ConcurrentCache<String, String> cache = new ConcurrentCache<String, String>(new LRUCache<String, String>(4));
        final CountDownLatch inCallback = new CountDownLatch(1);
        final CountDownLatch release = new CountDownLatch(1);
        cache.addListener(new CacheEventListener<String, String>() {
            @Override public void onPut(String key, String value) {
                inCallback.countDown();
                try {
                    release.await(5, TimeUnit.SECONDS);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
            }
        });

        final AtomicReference<Throwable> putFailure = new AtomicReference<Throwable>();
        Thread writer = new Thread(() -> {
            try {
                cache.put("k", "v");
            } catch (Throwable t) {
                putFailure.set(t);
            }
        });
        writer.start();
        assertTrue(inCallback.await(2, TimeUnit.SECONDS));

        Thread adder = new Thread(() -> cache.addListener(new CacheEventListener<String, String>() { }));
        adder.start();
        adder.join(200); // with the lock held by the writer, this must wait
        release.countDown();
        writer.join(2000);
        adder.join(2000);

        assertNull(putFailure.get(), "put failed: " + putFailure.get());
    }
}
