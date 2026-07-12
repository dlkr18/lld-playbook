package com.you.lld.problems.logging.model;

import java.util.HashMap;
import java.util.Map;

/**
 * Mapped Diagnostic Context (per-thread key/value map).
 * <p>
 * Typical use:
 * MDC.put("requestId", "abc-123");
 * MDC.put("userId", "u42");
 * try { logger.info("Processing order"); } finally { MDC.clear(); }
 * <p>
 * Each log call snapshots the current thread's MDC into the LogEvent so
 * async appenders see the caller's context, not the worker thread's empty one.
 * <p>
 * Thread safety: a plain HashMap per thread; never shared across threads.
 */
public final class MDC {

    private static final ThreadLocal<Map<String, String>> CONTEXT =
            ThreadLocal.withInitial(HashMap::new);

    private MDC() {
    }

    public static void put(String key, String value) {
        CONTEXT.get().put(key, value);
    }

    public static String get(String key) {
        return CONTEXT.get().get(key);
    }

    public static void remove(String key) {
        CONTEXT.get().remove(key);
    }

    public static void clear() {
        CONTEXT.get().clear();
    }

    /**
     * Snapshot used by Logger to populate LogEvent.
     */
    public static Map<String, String> snapshot() {
        Map<String, String> ctx = CONTEXT.get();
        return ctx.isEmpty() ? new HashMap<>() : new HashMap<>(ctx);
    }
}
