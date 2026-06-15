package com.you.lld.problems.lrucache;

import com.you.lld.problems.lrucache.api.Cache;
import com.you.lld.problems.lrucache.api.CacheStats;
import com.you.lld.problems.lrucache.impl.LRUCache;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Comprehensive unit tests for LRU Cache implementation.
 * 
 * <p>Test categories:
 * <ul>
 *   <li>Basic operations (get, put, size)</li>
 *   <li>Capacity management and eviction</li>
 *   <li>Access order tracking</li>
 *   <li>Edge cases (capacity=1, null values, etc.)</li>
 *   <li>Statistics tracking</li>
 * </ul>
 */
@DisplayName("LRU Cache Tests")
class LRUCacheTest {
    
    @Nested
    @DisplayName("Constructor Tests")
    class ConstructorTests {
        
        @Test
        @DisplayName("Should create cache with valid capacity")
        void shouldCreateCacheWithValidCapacity() {
            LRUCache<String, Integer> cache = new LRUCache<>(3);
            assertEquals(3, cache.capacity());
            assertEquals(0, cache.size());
        }
        
        @Test
        @DisplayName("Should throw exception for zero capacity")
        void shouldThrowExceptionForZeroCapacity() {
            assertThrows(IllegalArgumentException.class, () -> new LRUCache<String, Integer>(0));
        }
        
        @Test
        @DisplayName("Should throw exception for negative capacity")
        void shouldThrowExceptionForNegativeCapacity() {
            assertThrows(IllegalArgumentException.class, () -> new LRUCache<String, Integer>(-5));
        }
    }
    
    @Nested
    @DisplayName("Basic Operations")
    class BasicOperationsTests {
        private Cache<String, Integer> cache;
        
        @BeforeEach
        void setUp() {
            cache = new LRUCache<>(3);
        }
        
        @Test
        @DisplayName("Should put and get single item")
        void shouldPutAndGetSingleItem() {
            cache.put("one", 1);
            
            assertEquals(1, cache.size());
            assertEquals(Optional.of(1), cache.get("one"));
        }
        
        @Test
        @DisplayName("Should return empty for non-existent key")
        void shouldReturnEmptyForNonExistentKey() {
            assertEquals(Optional.empty(), cache.get("nonexistent"));
        }
        
        @Test
        @DisplayName("Should update existing key")
        void shouldUpdateExistingKey() {
            cache.put("key", 100);
            cache.put("key", 200);
            
            assertEquals(1, cache.size());
            assertEquals(Optional.of(200), cache.get("key"));
        }
        
        @Test
        @DisplayName("Should handle multiple items within capacity")
        void shouldHandleMultipleItemsWithinCapacity() {
            cache.put("one", 1);
            cache.put("two", 2);
            cache.put("three", 3);
            
            assertEquals(3, cache.size());
            assertEquals(Optional.of(1), cache.get("one"));
            assertEquals(Optional.of(2), cache.get("two"));
            assertEquals(Optional.of(3), cache.get("three"));
        }
        
        @Test
        @DisplayName("Should check if key exists")
        void shouldCheckIfKeyExists() {
            cache.put("exists", 123);
            
            assertTrue(cache.containsKey("exists"));
            assertFalse(cache.containsKey("notexists"));
        }
        
        @Test
        @DisplayName("Should clear all entries")
        void shouldClearAllEntries() {
            cache.put("one", 1);
            cache.put("two", 2);
            
            cache.clear();
            
            assertEquals(0, cache.size());
            assertEquals(Optional.empty(), cache.get("one"));
            assertEquals(Optional.empty(), cache.get("two"));
        }
    }
    
    @Nested
    @DisplayName("Eviction Tests")
    class EvictionTests {
        private Cache<String, Integer> cache;
        
        @BeforeEach
        void setUp() {
            cache = new LRUCache<>(3);
        }
        
        @Test
        @DisplayName("Should evict LRU item when capacity exceeded")
        void shouldEvictLRUItemWhenCapacityExceeded() {
            cache.put("one", 1);
            cache.put("two", 2);
            cache.put("three", 3);
            cache.put("four", 4); // Should evict "one"
            
            assertEquals(3, cache.size());
            assertEquals(Optional.empty(), cache.get("one"));
            assertEquals(Optional.of(2), cache.get("two"));
            assertEquals(Optional.of(3), cache.get("three"));
            assertEquals(Optional.of(4), cache.get("four"));
        }
        
        @Test
        @DisplayName("Should update LRU on get operation")
        void shouldUpdateLRUOnGetOperation() {
            cache.put("one", 1);
            cache.put("two", 2);
            cache.put("three", 3);
            
            // Access "one" to make it most recently used
            cache.get("one");
            
            cache.put("four", 4); // Should evict "two", not "one"
            
            assertEquals(Optional.of(1), cache.get("one"));
            assertEquals(Optional.empty(), cache.get("two"));
            assertEquals(Optional.of(3), cache.get("three"));
            assertEquals(Optional.of(4), cache.get("four"));
        }
        
        @Test
        @DisplayName("Should update LRU on put operation for existing key")
        void shouldUpdateLRUOnPutOperationForExistingKey() {
            cache.put("one", 1);
            cache.put("two", 2);
            cache.put("three", 3);
            
            // Update "one" to make it most recently used
            cache.put("one", 100);
            
            cache.put("four", 4); // Should evict "two", not "one"
            
            assertEquals(Optional.of(100), cache.get("one"));
            assertEquals(Optional.empty(), cache.get("two"));
            assertEquals(Optional.of(3), cache.get("three"));
            assertEquals(Optional.of(4), cache.get("four"));
        }
        
        @Test
        @DisplayName("Should maintain correct order with mixed operations")
        void shouldMaintainCorrectOrderWithMixedOperations() {
            cache.put("A", 1);
            cache.put("B", 2);
            cache.put("C", 3);
            
            cache.get("A");      // Order: A, C, B (LRU)
            cache.put("D", 4);   // Evict B, Order: D, A, C (LRU)
            cache.get("C");      // Order: C, D, A (LRU)
            cache.put("E", 5);   // Evict A, Order: E, C, D (LRU)
            
            assertEquals(Optional.empty(), cache.get("B"));
            assertEquals(Optional.empty(), cache.get("A"));
            assertEquals(Optional.of(3), cache.get("C"));
            assertEquals(Optional.of(4), cache.get("D"));
            assertEquals(Optional.of(5), cache.get("E"));
        }
    }
    
    @Nested
    @DisplayName("Edge Cases")
    class EdgeCaseTests {
        
        @Test
        @DisplayName("Should handle capacity of 1")
        void shouldHandleCapacityOfOne() {
            LRUCache<String, Integer> cache = new LRUCache<>(1);
            
            cache.put("first", 1);
            assertEquals(Optional.of(1), cache.get("first"));
            
            cache.put("second", 2);
            assertEquals(Optional.empty(), cache.get("first"));
            assertEquals(Optional.of(2), cache.get("second"));
        }
        
        @Test
        @DisplayName("Should handle large capacity")
        void shouldHandleLargeCapacity() {
            LRUCache<Integer, String> cache = new LRUCache<>(10000);
            
            for (int i = 0; i < 10000; i++) {
                cache.put(i, "value" + i);
            }
            
            assertEquals(10000, cache.size());
            assertEquals(Optional.of("value0"), cache.get(0));
            assertEquals(Optional.of("value9999"), cache.get(9999));
        }
        
        @Test
        @DisplayName("Should reject null key in put")
        void shouldRejectNullKeyInPut() {
            LRUCache<String, Integer> cache = new LRUCache<>(3);
            assertThrows(IllegalArgumentException.class, () -> cache.put(null, 1));
        }
        
        @Test
        @DisplayName("Should reject null value in put")
        void shouldRejectNullValueInPut() {
            LRUCache<String, Integer> cache = new LRUCache<>(3);
            assertThrows(IllegalArgumentException.class, () -> cache.put("key", null));
        }
        
        @Test
        @DisplayName("Should reject null key in get")
        void shouldRejectNullKeyInGet() {
            LRUCache<String, Integer> cache = new LRUCache<>(3);
            assertThrows(IllegalArgumentException.class, () -> cache.get(null));
        }
        
        @Test
        @DisplayName("Should reject null key in containsKey")
        void shouldRejectNullKeyInContainsKey() {
            LRUCache<String, Integer> cache = new LRUCache<>(3);
            assertThrows(IllegalArgumentException.class, () -> cache.containsKey(null));
        }
        
        @Test
        @DisplayName("Should handle same key-value put multiple times")
        void shouldHandleSameKeyValuePutMultipleTimes() {
            LRUCache<String, Integer> cache = new LRUCache<>(3);
            
            cache.put("key", 100);
            cache.put("key", 100);
            cache.put("key", 100);
            
            assertEquals(1, cache.size());
            assertEquals(Optional.of(100), cache.get("key"));
        }
    }
    
    @Nested
    @DisplayName("Statistics Tests")
    class StatisticsTests {
        private Cache<String, Integer> cache;

        @BeforeEach
        void setUp() {
            cache = new LRUCache<>(3);
        }

        private CacheStats stats() {
            return cache.stats();
        }

        @Test
        @DisplayName("Should track hits and misses")
        void shouldTrackHitsAndMisses() {
            cache.put("key1", 1);
            cache.put("key2", 2);

            cache.get("key1");
            cache.get("key2");
            cache.get("key3");
            cache.get("key4");

            assertEquals(2, stats().hits());
            assertEquals(2, stats().misses());
            assertEquals(0.5, stats().hitRate(), 0.001);
        }

        @Test
        @DisplayName("Should track evictions")
        void shouldTrackEvictions() {
            cache.put("one", 1);
            cache.put("two", 2);
            cache.put("three", 3);
            cache.put("four", 4);
            cache.put("five", 5);

            assertEquals(2, stats().evictions());
        }

        @Test
        @DisplayName("Should reset statistics on clear")
        void shouldResetStatisticsOnClear() {
            cache.put("key", 1);
            cache.get("key");
            cache.get("nonexistent");

            assertTrue(stats().hits() > 0 || stats().misses() > 0);

            cache.clear();

            assertEquals(0, stats().hits());
            assertEquals(0, stats().misses());
            assertEquals(0, stats().evictions());
        }

        @Test
        @DisplayName("Should calculate hit rate correctly")
        void shouldCalculateHitRateCorrectly() {
            cache.put("a", 1);
            cache.put("b", 2);

            cache.get("a");
            cache.get("a");
            cache.get("a");
            cache.get("c");

            assertEquals(0.75, stats().hitRate(), 0.001);
        }

        @Test
        @DisplayName("Should return 0 hit rate when no requests")
        void shouldReturnZeroHitRateWhenNoRequests() {
            assertEquals(0.0, stats().hitRate(), 0.001);
        }
    }

    @Nested
    @DisplayName("Invariant Tests")
    class InvariantTests {

        @Test
        @DisplayName("Should maintain size invariant")
        void shouldMaintainSizeInvariant() {
            Cache<String, Integer> cache = new LRUCache<>(3);

            for (int i = 0; i < 100; i++) {
                cache.put("key" + i, i);
                assertTrue(cache.size() <= cache.capacity(),
                    "Size should never exceed capacity");
            }
        }

        @Test
        @DisplayName("Should evict least recently used after capacity")
        void shouldEvictLeastRecentlyUsedAfterCapacity() {
            Cache<String, Integer> cache = new LRUCache<>(3);

            cache.put("A", 1);
            cache.put("B", 2);
            cache.put("C", 3);
            cache.get("A");
            cache.put("D", 4);

            assertFalse(cache.containsKey("B"));
            assertTrue(cache.containsKey("A"));
            assertTrue(cache.containsKey("C"));
            assertTrue(cache.containsKey("D"));
        }
    }
    
    @Nested
    @DisplayName("Different Data Types")
    class DifferentDataTypesTests {
        
        @Test
        @DisplayName("Should work with Integer keys and String values")
        void shouldWorkWithIntegerKeysAndStringValues() {
            LRUCache<Integer, String> cache = new LRUCache<>(2);
            
            cache.put(1, "one");
            cache.put(2, "two");
            
            assertEquals(Optional.of("one"), cache.get(1));
            assertEquals(Optional.of("two"), cache.get(2));
        }
        
        @Test
        @DisplayName("Should work with custom object keys")
        void shouldWorkWithCustomObjectKeys() {
            class Person {
                final String name;
                final int age;
                
                Person(String name, int age) {
                    this.name = name;
                    this.age = age;
                }
                
                @Override
                public boolean equals(Object o) {
                    if (this == o) return true;
                    if (o == null || getClass() != o.getClass()) return false;
                    Person person = (Person) o;
                    return age == person.age && name.equals(person.name);
                }
                
                @Override
                public int hashCode() {
                    return 31 * name.hashCode() + age;
                }
            }
            
            LRUCache<Person, String> cache = new LRUCache<>(2);
            Person john = new Person("John", 30);
            Person jane = new Person("Jane", 25);
            
            cache.put(john, "Engineer");
            cache.put(jane, "Doctor");
            
            assertEquals(Optional.of("Engineer"), cache.get(john));
            assertEquals(Optional.of("Doctor"), cache.get(jane));
        }
    }
}

