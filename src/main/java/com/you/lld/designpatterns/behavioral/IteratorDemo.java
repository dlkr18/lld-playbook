package com.you.lld.designpatterns.behavioral;

import java.util.Iterator;
import java.util.NoSuchElementException;

/**
 * Iterator — sequentially access elements of an aggregate without exposing its internals.
 * Use cases: any collection traversal, paginated APIs, tree walks, custom data structures.
 */
public class IteratorDemo {

    /** Tiny custom collection backed by a circular array. */
    static class RingBuffer<T> implements Iterable<T> {
        private final Object[] data;
        private int head = 0, size = 0;
        RingBuffer(int cap) { data = new Object[cap]; }
        void add(T v) {
            int idx = (head + size) % data.length;
            data[idx] = v;
            if (size == data.length) head = (head + 1) % data.length;
            else size++;
        }
        public Iterator<T> iterator() {
            return new Iterator<T>() {
                int seen = 0;
                public boolean hasNext() { return seen < size; }
                @SuppressWarnings("unchecked")
                public T next() {
                    if (!hasNext()) throw new NoSuchElementException();
                    T v = (T) data[(head + seen) % data.length];
                    seen++;
                    return v;
                }
            };
        }
    }

    public static void main(String[] args) {
        RingBuffer<String> log = new RingBuffer<String>(3);
        log.add("a"); log.add("b"); log.add("c"); log.add("d"); // "a" evicted
        for (String s : log) System.out.println(s);
    }
}
