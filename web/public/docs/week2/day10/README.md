# Day 10: Caching Strategies 🚀

**Focus**: Implement LRU, LFU, and TTL caching with consistency and stampede protection.

---

## 🎯 **Learning Objectives**

By the end of Day 10, you will:
- **Implement** LRU, LFU, and TTL cache eviction policies
- **Handle** cache consistency challenges
- **Prevent** cache stampede and thundering herd
- **Design** multi-level caching strategies

---

## 📚 **Cache Eviction Policies**

### **1. LRU Cache (Least Recently Used)**

```java
public class LRUCache<K, V> {
    
    private final int capacity;
    private final Map<K, Node<K, V>> cache;
    private final DoublyLinkedList<K, V> list;
    
    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.cache = new HashMap<>();
        this.list = new DoublyLinkedList<>();
    }
    
    public synchronized V get(K key) {
        Node<K, V> node = cache.get(key);
        if (node == null) {
            return null;
        }
        
        // Move to front (most recently used)
        list.moveToFront(node);
        return node.value;
    }
    
    public synchronized void put(K key, V value) {
        Node<K, V> existing = cache.get(key);
        
        if (existing != null) {
            existing.value = value;
            list.moveToFront(existing);
            return;
        }
        
        // Evict if at capacity
        if (cache.size() >= capacity) {
            Node<K, V> lru = list.removeLast();
            cache.remove(lru.key);
        }
        
        // Add new node
        Node<K, V> node = new Node<>(key, value);
        list.addFirst(node);
        cache.put(key, node);
    }
    
    public synchronized void remove(K key) {
        Node<K, V> node = cache.remove(key);
        if (node != null) {
            list.remove(node);
        }
    }
    
    public int size() {
        return cache.size();
    }
    
    // Node class
    private static class Node<K, V> {
        K key;
        V value;
        Node<K, V> prev;
        Node<K, V> next;
        
        Node(K key, V value) {
            this.key = key;
            this.value = value;
        }
    }
    
    // Doubly linked list
    private static class DoublyLinkedList<K, V> {
        private Node<K, V> head;
        private Node<K, V> tail;
        
        void addFirst(Node<K, V> node) {
            node.next = head;
            node.prev = null;
            
            if (head != null) {
                head.prev = node;
            }
            head = node;
            
            if (tail == null) {
                tail = node;
            }
        }
        
        void moveToFront(Node<K, V> node) {
            if (node == head) return;
            remove(node);
            addFirst(node);
        }
        
        void remove(Node<K, V> node) {
            if (node.prev != null) {
                node.prev.next = node.next;
            } else {
                head = node.next;
            }
            
            if (node.next != null) {
                node.next.prev = node.prev;
            } else {
                tail = node.prev;
            }
        }
        
        Node<K, V> removeLast() {
            if (tail == null) return null;
            Node<K, V> node = tail;
            remove(node);
            return node;
        }
    }
}
```

### **2. LFU Cache (Least Frequently Used)**

```java
public class LFUCache<K, V> {
    
    private final int capacity;
    private int minFrequency;
    private final Map<K, Node<K, V>> cache;
    private final Map<Integer, DoublyLinkedList<K, V>> frequencyMap;
    
    public LFUCache(int capacity) {
        this.capacity = capacity;
        this.minFrequency = 0;
        this.cache = new HashMap<>();
        this.frequencyMap = new HashMap<>();
    }
    
    public synchronized V get(K key) {
        Node<K, V> node = cache.get(key);
        if (node == null) {
            return null;
        }
        
        updateFrequency(node);
        return node.value;
    }
    
    public synchronized void put(K key, V value) {
        if (capacity <= 0) return;
        
        Node<K, V> existing = cache.get(key);
        if (existing != null) {
            existing.value = value;
            updateFrequency(existing);
            return;
        }
        
        // Evict if at capacity
        if (cache.size() >= capacity) {
            evictLFU();
        }
        
        // Add new node with frequency 1
        Node<K, V> node = new Node<>(key, value);
        node.frequency = 1;
        cache.put(key, node);
        
        frequencyMap.computeIfAbsent(1, k -> new DoublyLinkedList<>()).addFirst(node);
        minFrequency = 1;
    }
    
    private void updateFrequency(Node<K, V> node) {
        int oldFreq = node.frequency;
        DoublyLinkedList<K, V> oldList = frequencyMap.get(oldFreq);
        oldList.remove(node);
        
        // Update min frequency if needed
        if (oldFreq == minFrequency && oldList.isEmpty()) {
            minFrequency++;
        }
        
        // Add to new frequency list
        node.frequency++;
        frequencyMap.computeIfAbsent(node.frequency, k -> new DoublyLinkedList<>())
            .addFirst(node);
    }
    
    private void evictLFU() {
        DoublyLinkedList<K, V> minList = frequencyMap.get(minFrequency);
        Node<K, V> lfu = minList.removeLast();
        cache.remove(lfu.key);
    }
    
    private static class Node<K, V> {
        K key;
        V value;
        int frequency;
        Node<K, V> prev;
        Node<K, V> next;
        
        Node(K key, V value) {
            this.key = key;
            this.value = value;
            this.frequency = 0;
        }
    }
}
```

### **3. TTL Cache (Time-To-Live)**

```java
public class TTLCache<K, V> {
    
    private final Map<K, CacheEntry<V>> cache;
    private final long defaultTtlMillis;
    private final ScheduledExecutorService cleaner;
    
    public TTLCache(long defaultTtlMillis) {
        this.cache = new ConcurrentHashMap<>();
        this.defaultTtlMillis = defaultTtlMillis;
        this.cleaner = Executors.newSingleThreadScheduledExecutor();
        
        // Schedule periodic cleanup
        cleaner.scheduleAtFixedRate(this::cleanup, 
            defaultTtlMillis, defaultTtlMillis, TimeUnit.MILLISECONDS);
    }
    
    public V get(K key) {
        CacheEntry<V> entry = cache.get(key);
        if (entry == null) {
            return null;
        }
        
        if (entry.isExpired()) {
            cache.remove(key);
            return null;
        }
        
        return entry.value;
    }
    
    public void put(K key, V value) {
        put(key, value, defaultTtlMillis);
    }
    
    public void put(K key, V value, long ttlMillis) {
        long expiresAt = System.currentTimeMillis() + ttlMillis;
        cache.put(key, new CacheEntry<>(value, expiresAt));
    }
    
    public void remove(K key) {
        cache.remove(key);
    }
    
    public void clear() {
        cache.clear();
    }
    
    private void cleanup() {
        long now = System.currentTimeMillis();
        cache.entrySet().removeIf(entry -> entry.getValue().expiresAt < now);
    }
    
    public void shutdown() {
        cleaner.shutdown();
    }
    
    private static class CacheEntry<V> {
        final V value;
        final long expiresAt;
        
        CacheEntry(V value, long expiresAt) {
            this.value = value;
            this.expiresAt = expiresAt;
        }
        
        boolean isExpired() {
            return System.currentTimeMillis() > expiresAt;
        }
    }
}
```

---

## 🛡️ **Cache Stampede Prevention**

### **Problem**: Multiple threads request same expired key simultaneously

```java
public class StampedeProtectedCache<K, V> {
    
    private final TTLCache<K, V> cache;
    private final Map<K, CompletableFuture<V>> pending;
    private final Function<K, V> loader;
    
    public StampedeProtectedCache(long ttlMillis, Function<K, V> loader) {
        this.cache = new TTLCache<>(ttlMillis);
        this.pending = new ConcurrentHashMap<>();
        this.loader = loader;
    }
    
    public V get(K key) {
        // Check cache first
        V cached = cache.get(key);
        if (cached != null) {
            return cached;
        }
        
        // Use computeIfAbsent to ensure only one thread loads
        CompletableFuture<V> future = pending.computeIfAbsent(key, k -> {
            return CompletableFuture.supplyAsync(() -> {
                try {
                    V value = loader.apply(k);
                    cache.put(k, value);
                    return value;
                } finally {
                    pending.remove(k);
                }
            });
        });
        
        try {
            return future.get();
        } catch (Exception e) {
            throw new CacheException("Failed to load value", e);
        }
    }
}
```

### **Probabilistic Early Expiration**

```java
public class ProbabilisticCache<K, V> {
    
    private final Map<K, ProbabilisticEntry<V>> cache;
    private final Function<K, V> loader;
    private final long ttlMillis;
    private final double beta; // Typically 1.0
    
    public V get(K key) {
        ProbabilisticEntry<V> entry = cache.get(key);
        
        if (entry == null) {
            return load(key);
        }
        
        // Probabilistic early recomputation
        long now = System.currentTimeMillis();
        long delta = entry.expiresAt - now;
        double random = Math.random();
        double threshold = Math.exp(-delta * beta / entry.computeTime);
        
        if (random < threshold) {
            // Early refresh
            return load(key);
        }
        
        if (now > entry.expiresAt) {
            return load(key);
        }
        
        return entry.value;
    }
    
    private V load(K key) {
        long start = System.currentTimeMillis();
        V value = loader.apply(key);
        long computeTime = System.currentTimeMillis() - start;
        
        cache.put(key, new ProbabilisticEntry<>(
            value, 
            System.currentTimeMillis() + ttlMillis,
            computeTime
        ));
        
        return value;
    }
    
    private static class ProbabilisticEntry<V> {
        V value;
        long expiresAt;
        long computeTime;
        
        ProbabilisticEntry(V value, long expiresAt, long computeTime) {
            this.value = value;
            this.expiresAt = expiresAt;
            this.computeTime = computeTime;
        }
    }
}
```

---

## 🏗️ **Multi-Level Caching**

```java
public class MultiLevelCache<K, V> {
    
    private final LRUCache<K, V> l1Cache;  // Fast, small
    private final TTLCache<K, V> l2Cache;   // Slower, larger
    private final Function<K, V> dataSource;
    
    public MultiLevelCache(int l1Size, long l2TtlMillis, Function<K, V> dataSource) {
        this.l1Cache = new LRUCache<>(l1Size);
        this.l2Cache = new TTLCache<>(l2TtlMillis);
        this.dataSource = dataSource;
    }
    
    public V get(K key) {
        // Try L1 first
        V value = l1Cache.get(key);
        if (value != null) {
            return value;
        }
        
        // Try L2
        value = l2Cache.get(key);
        if (value != null) {
            l1Cache.put(key, value); // Promote to L1
            return value;
        }
        
        // Load from data source
        value = dataSource.apply(key);
        if (value != null) {
            l2Cache.put(key, value);
            l1Cache.put(key, value);
        }
        
        return value;
    }
    
    public void invalidate(K key) {
        l1Cache.remove(key);
        l2Cache.remove(key);
    }
    
    public void invalidateAll() {
        l1Cache.clear();
        l2Cache.clear();
    }
}
```

---

## 🔄 **Cache Consistency Patterns**

### **Write-Through**
```java
public void put(K key, V value) {
    dataSource.write(key, value);  // Write to DB first
    cache.put(key, value);          // Then update cache
}
```

### **Write-Behind (Async)**
```java
public void put(K key, V value) {
    cache.put(key, value);  // Update cache immediately
    writeQueue.add(new WriteOperation(key, value));  // Async write
}
```

### **Cache-Aside**
```java
public V get(K key) {
    V value = cache.get(key);
    if (value == null) {
        value = dataSource.read(key);
        cache.put(key, value);
    }
    return value;
}

public void put(K key, V value) {
    dataSource.write(key, value);
    cache.invalidate(key);  // Invalidate, don't update
}
```

---

## 🎯 **Best Practices**

1. **Choose the right policy**: LRU for recency, LFU for frequency, TTL for freshness
2. **Set appropriate sizes**: Balance memory vs hit rate
3. **Monitor metrics**: Hit rate, eviction rate, latency
4. **Handle failures**: Cache should be optional, not required
5. **Prevent stampede**: Use locks or probabilistic refresh

---

**Next**: [Weekend - Elevator System](week2/weekend/README.md) →
