package com.you.lld.problems.lrucache.impl;

import com.you.lld.problems.lrucache.api.Cache;
import java.util.*;

public class LRUCache<K, V> implements Cache<K, V> {
    private final int capacity;
    private final Map<K, Node<K, V>> map;
    private final DoublyLinkedList<K, V> list;
    
    public LRUCache(int capacity) {
        this.capacity = capacity;
        this.map = new HashMap<>();
        this.list = new DoublyLinkedList<>();
    }
    
    @Override
    public V get(K key) {
        if (!map.containsKey(key)) {
            return null;
        }
        
        Node<K, V> node = map.get(key);
        list.moveToHead(node);
        return node.value;
    }
    
    @Override
    public void put(K key, V value) {
        if (map.containsKey(key)) {
            Node<K, V> node = map.get(key);
            node.value = value;
            list.moveToHead(node);
        } else {
            if (map.size() >= capacity) {
                Node<K, V> removed = list.removeTail();
                if (removed != null) {
                    map.remove(removed.key);
                }
            }
            
            Node<K, V> newNode = new Node<>(key, value);
            list.addToHead(newNode);
            map.put(key, newNode);
        }
    }
    
    @Override
    public void remove(K key) {
        if (map.containsKey(key)) {
            Node<K, V> node = map.get(key);
            list.remove(node);
            map.remove(key);
        }
    }
    
    @Override
    public void clear() {
        map.clear();
        list.clear();
    }
    
    @Override
    public int size() {
        return map.size();
    }
    
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
    
    private static class DoublyLinkedList<K, V> {
        private Node<K, V> head;
        private Node<K, V> tail;
        
        DoublyLinkedList() {
            head = new Node<>(null, null);
            tail = new Node<>(null, null);
            head.next = tail;
            tail.prev = head;
        }
        
        void addToHead(Node<K, V> node) {
            node.next = head.next;
            node.prev = head;
            head.next.prev = node;
            head.next = node;
        }
        
        void remove(Node<K, V> node) {
            node.prev.next = node.next;
            node.next.prev = node.prev;
        }
        
        void moveToHead(Node<K, V> node) {
            remove(node);
            addToHead(node);
        }
        
        Node<K, V> removeTail() {
            Node<K, V> node = tail.prev;
            if (node == head) {
                return null;
            }
            remove(node);
            return node;
        }
        
        void clear() {
            head.next = tail;
            tail.prev = head;
        }
    }
}
