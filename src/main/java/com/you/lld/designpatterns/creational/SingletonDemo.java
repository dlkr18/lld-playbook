package com.you.lld.designpatterns.creational;

/**
 * Singleton — exactly one instance, global access.
 * Use cases: config registry, logger, connection pool.
 * <p>
 * Variants shown:
 * - Bill-Pugh (lazy, thread-safe via classloader, no synchronization cost) — RECOMMENDED.
 * - Enum singleton (serialization & reflection safe) — RECOMMENDED for simple cases.
 * - Double-checked locking (legacy, needs volatile).
 */
public final class SingletonDemo {

    /* ---------- Bill-Pugh holder idiom ---------- */
    public static final class ConfigRegistry {
        private ConfigRegistry() {
        }

        private static class Holder {
            static final ConfigRegistry INSTANCE = new ConfigRegistry();
        }

        public static ConfigRegistry get() {
            return Holder.INSTANCE;
        }

        public String env() {
            return "prod";
        }
    }

    /* ---------- Enum singleton ---------- */
    public enum AppLogger {
        INSTANCE;

        public void log(String msg) {
            System.out.println("[LOG] " + msg);
        }
    }

    /* ---------- Double-checked locking ---------- */
    public static final class DbPool {
        private static volatile DbPool instance;

        private DbPool() {
        }

        public static DbPool get() {
            DbPool local = instance;
            if (local == null) {
                synchronized (DbPool.class) {
                    local = instance;
                    if (local == null) instance = local = new DbPool();
                }
            }
            return local;
        }
    }

    public static void main(String[] args) {
        System.out.println(ConfigRegistry.get() == ConfigRegistry.get());
        AppLogger.INSTANCE.log("hello");
        System.out.println(DbPool.get() == DbPool.get());
    }
}
