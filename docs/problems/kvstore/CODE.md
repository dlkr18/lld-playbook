# Key-Value Store - In-Memory Database 🗄️

Production-ready **in-memory key-value store** with **Write-Ahead Log (WAL)**, **snapshots**, **persistence**, and **crash recovery**. Foundation for caching and databases.

---

## 🎯 **Core Features**

✅ **In-Memory Storage** - Fast HashMap-based  
✅ **Write-Ahead Log (WAL)** - Durability guarantee  
✅ **Snapshots** - Point-in-time backups  
✅ **Crash Recovery** - Replay WAL on restart  
✅ **TTL Support** - Automatic expiration  
✅ **Transactions** - ACID properties  

---

## 📚 **Architecture**

```
KVStore
 ├── In-Memory HashMap
 ├── Write-Ahead Log (append-only)
 ├── Snapshot Manager
 ├── TTL Manager
 └── Recovery Manager
```

---

## 💻 **Implementation**

### **1. Basic KV Store:**

```java
public class KVStore {
    
    private final ConcurrentHashMap<String, Value> store = new ConcurrentHashMap<>();
    private final WriteAheadLog wal;
    private final SnapshotManager snapshotManager;
    
    public void put(String key, String value) {
        // 1. Write to WAL first (durability)
        wal.append(new PutOperation(key, value));
        
        // 2. Update in-memory
        store.put(key, new Value(value, System.currentTimeMillis()));
    }
    
    public Optional<String> get(String key) {
        Value value = store.get(key);
        if (value == null) return Optional.empty();
        
        // Check TTL
        if (value.isExpired()) {
            delete(key);
            return Optional.empty();
        }
        
        return Optional.of(value.getData());
    }
    
    public void delete(String key) {
        wal.append(new DeleteOperation(key));
        store.remove(key);
    }
}
```

### **2. Write-Ahead Log:**

```java
/**
 * Append-only log for durability.
 */
public class WriteAheadLog {
    
    private final Path logFile;
    private final BufferedWriter writer;
    private long sequenceNumber = 0;
    
    public synchronized void append(Operation operation) {
        try {
            LogEntry entry = new LogEntry(
                sequenceNumber++,
                System.currentTimeMillis(),
                operation
            );
            
            writer.write(entry.serialize());
            writer.newLine();
            writer.flush();  // Force to disk
            
        } catch (IOException e) {
            throw new WALException("Failed to append to WAL", e);
        }
    }
    
    /**
     * Replay log entries for crash recovery.
     */
    public void replay(Consumer<LogEntry> consumer) {
        try (BufferedReader reader = Files.newBufferedReader(logFile)) {
            String line;
            while ((line = reader.readLine()) != null) {
                LogEntry entry = LogEntry.deserialize(line);
                consumer.accept(entry);
            }
        } catch (IOException e) {
            throw new WALException("Failed to replay WAL", e);
        }
    }
}
```

### **3. Snapshots:**

```java
/**
 * Point-in-time snapshots for backup and recovery.
 */
public class SnapshotManager {
    
    private final Path snapshotDir;
    
    public void takeSnapshot(Map<String, Value> store) {
        String timestamp = Instant.now().toString();
        Path snapshotFile = snapshotDir.resolve("snapshot-" + timestamp);
        
        try (ObjectOutputStream oos = new ObjectOutputStream(
                Files.newOutputStream(snapshotFile))) {
            
            oos.writeObject(new HashMap<>(store));
            
            logger.info("Snapshot saved: {}", snapshotFile);
            
        } catch (IOException e) {
            throw new SnapshotException("Failed to take snapshot", e);
        }
    }
    
    public Map<String, Value> loadLatestSnapshot() {
        Optional<Path> latest = findLatestSnapshot();
        
        if (!latest.isPresent()) {
            return new HashMap<>();
        }
        
        try (ObjectInputStream ois = new ObjectInputStream(
                Files.newInputStream(latest.get()))) {
            
            return (Map<String, Value>) ois.readObject();
            
        } catch (Exception e) {
            throw new SnapshotException("Failed to load snapshot", e);
        }
    }
}
```

---

## 🔄 **Crash Recovery**

```java
/**
 * Recovery process on startup.
 */
public void recover() {
    logger.info("Starting recovery...");
    
    // 1. Load latest snapshot (if exists)
    Map<String, Value> recovered = snapshotManager.loadLatestSnapshot();
    store.putAll(recovered);
    logger.info("Loaded snapshot with {} entries", recovered.size());
    
    // 2. Replay WAL entries after snapshot
    long snapshotSeq = snapshotManager.getSnapshotSequenceNumber();
    
    wal.replay(entry -> {
        if (entry.getSequenceNumber() > snapshotSeq) {
            Operation op = entry.getOperation();
            
            if (op instanceof PutOperation) {
                PutOperation put = (PutOperation) op;
                store.put(put.getKey(), new Value(put.getValue()));
            } else if (op instanceof DeleteOperation) {
                DeleteOperation delete = (DeleteOperation) op;
                store.remove(delete.getKey());
            }
        }
    });
    
    logger.info("Recovery complete. Store has {} entries", store.size());
}
```

---

## 📝 **Usage Examples**

```java
// Initialize with persistence
KVStore kv = new KVStore(
    Paths.get("/data/wal"),
    Paths.get("/data/snapshots")
);

// Basic operations
kv.put("user:123", "{\"name\":\"Alice\"}");
kv.put("config:timeout", "30");

Optional<String> user = kv.get("user:123");

kv.delete("config:timeout");

// TTL support
kv.putWithTTL("session:abc", "token123", Duration.ofMinutes(30));

// Snapshot (for backup)
kv.takeSnapshot();

// After crash/restart
kv.recover();  // Automatically loads snapshot + replays WAL
```

---

## 🔗 **Related Resources**

- [Day 14: KV Store with WAL](week3/day14/README.md)
- [LRU Cache](problems/lrucache/CODE.md)

---

**Implementation Guide**: `src/main/java/com/you/lld/problems/kvstore/`

---

✨ **Durable in-memory storage with crash recovery!** 🗄️

