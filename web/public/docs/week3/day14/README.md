# Day 14: In-Memory Key-Value Store 🗄️

**Focus**: Build a durable KV store with Write-Ahead Logging, snapshots, and compaction.

---

## 🎯 **Learning Objectives**

By the end of Day 14, you will:
- **Implement** a thread-safe in-memory KV store
- **Add** Write-Ahead Logging for durability
- **Create** snapshot mechanism for fast recovery
- **Design** compaction for log maintenance

---

## 📚 **Architecture Overview**

```
┌─────────────────────────────────────────────────────┐
│                    KV Store                          │
├─────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │  In-Memory  │  │     WAL     │  │  Snapshot   │ │
│  │    Store    │  │   Writer    │  │   Manager   │ │
│  └─────────────┘  └─────────────┘  └─────────────┘ │
│         ↑                ↑                ↑        │
│         └────────────────┼────────────────┘        │
│                          ↓                          │
│              ┌─────────────────────┐               │
│              │   Recovery Engine   │               │
│              └─────────────────────┘               │
└─────────────────────────────────────────────────────┘
```

---

## 🏗️ **Core Implementation**

### **KV Store Interface**

```java
public interface KeyValueStore<K, V> {
    
    V get(K key);
    
    void put(K key, V value);
    
    void put(K key, V value, Duration ttl);
    
    V delete(K key);
    
    boolean contains(K key);
    
    Set<K> keys();
    
    int size();
    
    void clear();
    
    // Batch operations
    Map<K, V> multiGet(Collection<K> keys);
    
    void multiPut(Map<K, V> entries);
    
    // Atomic operations
    V putIfAbsent(K key, V value);
    
    boolean compareAndSet(K key, V expected, V newValue);
    
    V getAndUpdate(K key, Function<V, V> updateFunction);
}
```

### **In-Memory Store**

```java
public class InMemoryKVStore<K, V> implements KeyValueStore<K, V> {
    
    private final ConcurrentHashMap<K, ValueWrapper<V>> store;
    private final WALWriter<K, V> walWriter;
    private final SnapshotManager<K, V> snapshotManager;
    private final ScheduledExecutorService scheduler;
    
    public InMemoryKVStore(String dataDir) {
        this.store = new ConcurrentHashMap<>();
        this.walWriter = new WALWriter<>(dataDir + "/wal");
        this.snapshotManager = new SnapshotManager<>(dataDir + "/snapshots");
        this.scheduler = Executors.newScheduledThreadPool(2);
        
        // Recovery
        recover();
        
        // Schedule maintenance
        scheduler.scheduleAtFixedRate(this::cleanup, 1, 1, TimeUnit.MINUTES);
        scheduler.scheduleAtFixedRate(this::maybeSnapshot, 5, 5, TimeUnit.MINUTES);
    }
    
    @Override
    public V get(K key) {
        ValueWrapper<V> wrapper = store.get(key);
        if (wrapper == null) {
            return null;
        }
        
        if (wrapper.isExpired()) {
            store.remove(key);
            return null;
        }
        
        return wrapper.getValue();
    }
    
    @Override
    public void put(K key, V value) {
        put(key, value, null);
    }
    
    @Override
    public void put(K key, V value, Duration ttl) {
        // Write to WAL first (durability)
        WALEntry<K, V> entry = new WALEntry<>(
            WALOperation.PUT, key, value, 
            ttl != null ? Instant.now().plus(ttl) : null
        );
        walWriter.append(entry);
        
        // Then update in-memory store
        Long expiresAt = ttl != null ? 
            System.currentTimeMillis() + ttl.toMillis() : null;
        store.put(key, new ValueWrapper<>(value, expiresAt));
    }
    
    @Override
    public V delete(K key) {
        walWriter.append(new WALEntry<>(WALOperation.DELETE, key, null, null));
        
        ValueWrapper<V> removed = store.remove(key);
        return removed != null ? removed.getValue() : null;
    }
    
    @Override
    public V putIfAbsent(K key, V value) {
        return store.compute(key, (k, existing) -> {
            if (existing == null || existing.isExpired()) {
                walWriter.append(new WALEntry<>(WALOperation.PUT, key, value, null));
                return new ValueWrapper<>(value, null);
            }
            return existing;
        }).getValue();
    }
    
    @Override
    public boolean compareAndSet(K key, V expected, V newValue) {
        return store.computeIfPresent(key, (k, current) -> {
            if (Objects.equals(current.getValue(), expected)) {
                walWriter.append(new WALEntry<>(WALOperation.PUT, key, newValue, null));
                return new ValueWrapper<>(newValue, current.getExpiresAt());
            }
            return current;
        }) != null;
    }
    
    private void cleanup() {
        long now = System.currentTimeMillis();
        store.entrySet().removeIf(entry -> {
            ValueWrapper<V> wrapper = entry.getValue();
            return wrapper.isExpired();
        });
    }
    
    private static class ValueWrapper<V> {
        private final V value;
        private final Long expiresAt;
        
        ValueWrapper(V value, Long expiresAt) {
            this.value = value;
            this.expiresAt = expiresAt;
        }
        
        V getValue() { return value; }
        Long getExpiresAt() { return expiresAt; }
        
        boolean isExpired() {
            return expiresAt != null && System.currentTimeMillis() > expiresAt;
        }
    }
}
```

---

## 📝 **Write-Ahead Log (WAL)**

```java
public class WALWriter<K, V> {
    
    private final Path walDir;
    private FileChannel currentFile;
    private long currentSegment;
    private long position;
    private final long maxSegmentSize;
    private final Serializer<WALEntry<K, V>> serializer;
    private final ReentrantLock lock = new ReentrantLock();
    
    public WALWriter(String walDir) {
        this.walDir = Paths.get(walDir);
        this.maxSegmentSize = 64 * 1024 * 1024; // 64 MB
        this.serializer = new WALEntrySerializer<>();
        
        Files.createDirectories(this.walDir);
        rotateToNewSegment();
    }
    
    public void append(WALEntry<K, V> entry) {
        lock.lock();
        try {
            byte[] data = serializer.serialize(entry);
            
            // Check if rotation needed
            if (position + data.length > maxSegmentSize) {
                rotateToNewSegment();
            }
            
            // Write length prefix + data
            ByteBuffer buffer = ByteBuffer.allocate(4 + data.length);
            buffer.putInt(data.length);
            buffer.put(data);
            buffer.flip();
            
            currentFile.write(buffer);
            position += buffer.capacity();
            
            // fsync for durability
            currentFile.force(true);
        } catch (IOException e) {
            throw new WALException("Failed to append to WAL", e);
        } finally {
            lock.unlock();
        }
    }
    
    public List<WALEntry<K, V>> readAll() {
        List<WALEntry<K, V>> entries = new ArrayList<>();
        
        try {
            List<Path> segments = Files.list(walDir)
                .filter(p -> p.toString().endsWith(".wal"))
                .sorted()
                .collect(Collectors.toList());
            
            for (Path segment : segments) {
                entries.addAll(readSegment(segment));
            }
        } catch (IOException e) {
            throw new WALException("Failed to read WAL", e);
        }
        
        return entries;
    }
    
    private List<WALEntry<K, V>> readSegment(Path segment) throws IOException {
        List<WALEntry<K, V>> entries = new ArrayList<>();
        
        try (FileChannel channel = FileChannel.open(segment, StandardOpenOption.READ)) {
            ByteBuffer lengthBuffer = ByteBuffer.allocate(4);
            
            while (channel.read(lengthBuffer) == 4) {
                lengthBuffer.flip();
                int length = lengthBuffer.getInt();
                
                ByteBuffer dataBuffer = ByteBuffer.allocate(length);
                channel.read(dataBuffer);
                dataBuffer.flip();
                
                byte[] data = new byte[length];
                dataBuffer.get(data);
                
                entries.add(serializer.deserialize(data));
                lengthBuffer.clear();
            }
        }
        
        return entries;
    }
    
    private void rotateToNewSegment() {
        try {
            if (currentFile != null) {
                currentFile.close();
            }
            
            currentSegment = System.currentTimeMillis();
            Path segmentPath = walDir.resolve(currentSegment + ".wal");
            currentFile = FileChannel.open(segmentPath,
                StandardOpenOption.CREATE, StandardOpenOption.WRITE);
            position = 0;
        } catch (IOException e) {
            throw new WALException("Failed to rotate WAL segment", e);
        }
    }
}

public class WALEntry<K, V> {
    private final WALOperation operation;
    private final K key;
    private final V value;
    private final Instant expiresAt;
    private final long timestamp;
    
    public enum WALOperation {
        PUT, DELETE, CLEAR
    }
}
```

---

## 📸 **Snapshot Manager**

```java
public class SnapshotManager<K, V> {
    
    private final Path snapshotDir;
    private final Serializer<Map<K, V>> serializer;
    
    public void createSnapshot(Map<K, V> data) {
        try {
            String snapshotName = "snapshot-" + System.currentTimeMillis() + ".snap";
            Path snapshotPath = snapshotDir.resolve(snapshotName);
            
            byte[] serialized = serializer.serialize(data);
            
            // Write atomically
            Path tempPath = snapshotPath.resolveSibling(snapshotName + ".tmp");
            Files.write(tempPath, serialized);
            Files.move(tempPath, snapshotPath, StandardCopyOption.ATOMIC_MOVE);
            
            // Clean old snapshots (keep last 3)
            cleanOldSnapshots(3);
        } catch (IOException e) {
            throw new SnapshotException("Failed to create snapshot", e);
        }
    }
    
    public Map<K, V> loadLatestSnapshot() {
        try {
            Optional<Path> latest = Files.list(snapshotDir)
                .filter(p -> p.toString().endsWith(".snap"))
                .max(Comparator.comparingLong(this::extractTimestamp));
            
            if (latest.isPresent()) {
                byte[] data = Files.readAllBytes(latest.get());
                return serializer.deserialize(data);
            }
            
            return new HashMap<>();
        } catch (IOException e) {
            throw new SnapshotException("Failed to load snapshot", e);
        }
    }
    
    public long getLatestSnapshotTimestamp() {
        try {
            return Files.list(snapshotDir)
                .filter(p -> p.toString().endsWith(".snap"))
                .mapToLong(this::extractTimestamp)
                .max()
                .orElse(0);
        } catch (IOException e) {
            return 0;
        }
    }
    
    private long extractTimestamp(Path path) {
        String name = path.getFileName().toString();
        return Long.parseLong(name.replace("snapshot-", "").replace(".snap", ""));
    }
    
    private void cleanOldSnapshots(int keepCount) throws IOException {
        List<Path> snapshots = Files.list(snapshotDir)
            .filter(p -> p.toString().endsWith(".snap"))
            .sorted(Comparator.comparingLong(this::extractTimestamp).reversed())
            .collect(Collectors.toList());
        
        for (int i = keepCount; i < snapshots.size(); i++) {
            Files.delete(snapshots.get(i));
        }
    }
}
```

---

## 🔄 **Recovery Engine**

```java
public class RecoveryEngine<K, V> {
    
    private final SnapshotManager<K, V> snapshotManager;
    private final WALWriter<K, V> walWriter;
    
    public Map<K, V> recover() {
        // Load latest snapshot
        Map<K, V> state = new HashMap<>(snapshotManager.loadLatestSnapshot());
        long snapshotTimestamp = snapshotManager.getLatestSnapshotTimestamp();
        
        // Replay WAL entries after snapshot
        List<WALEntry<K, V>> walEntries = walWriter.readAll();
        
        for (WALEntry<K, V> entry : walEntries) {
            if (entry.getTimestamp() > snapshotTimestamp) {
                applyEntry(state, entry);
            }
        }
        
        return state;
    }
    
    private void applyEntry(Map<K, V> state, WALEntry<K, V> entry) {
        switch (entry.getOperation()) {
            case PUT:
                // Check TTL
                if (entry.getExpiresAt() == null || 
                    entry.getExpiresAt().isAfter(Instant.now())) {
                    state.put(entry.getKey(), entry.getValue());
                }
                break;
            case DELETE:
                state.remove(entry.getKey());
                break;
            case CLEAR:
                state.clear();
                break;
        }
    }
}
```

---

## 🎯 **Best Practices**

1. **Durability**: Always fsync WAL before acknowledging writes
2. **Recovery**: Test recovery path regularly
3. **Compaction**: Schedule during low-traffic periods
4. **Monitoring**: Track WAL size, snapshot frequency
5. **Memory**: Set limits to prevent OOM

---

**Next**: [Day 15 - Search/Index](week3/day15/README.md) →
