package com.you.lld.designpatterns.structural;

import java.util.HashMap;
import java.util.Map;

/**
 * Proxy — a stand-in for another object to control access. Same interface as the real subject.
 * Variants: virtual (lazy-load expensive resource), protection (auth check), remote (RPC stub),
 * caching, logging.
 * Use cases: ORM lazy loading, Spring AOP, HTTP caching layer, RMI stubs.
 */
public class ProxyDemo {

    interface UserRepo { String findById(String id); }

    /* Real subject — expensive */
    static class DatabaseUserRepo implements UserRepo {
        public String findById(String id) {
            try { Thread.sleep(50); } catch (InterruptedException ignored) { }
            return "User(" + id + ")";
        }
    }

    /* Caching proxy */
    static class CachingUserRepoProxy implements UserRepo {
        private final UserRepo delegate;
        private final Map<String, String> cache = new HashMap<String, String>();
        CachingUserRepoProxy(UserRepo d) { this.delegate = d; }
        public String findById(String id) {
            String hit = cache.get(id);
            if (hit != null) { System.out.println("cache hit: " + id); return hit; }
            System.out.println("cache miss: " + id);
            String fresh = delegate.findById(id);
            cache.put(id, fresh);
            return fresh;
        }
    }

    public static void main(String[] args) {
        UserRepo repo = new CachingUserRepoProxy(new DatabaseUserRepo());
        System.out.println(repo.findById("u1"));
        System.out.println(repo.findById("u1"));
        System.out.println(repo.findById("u2"));
    }
}
