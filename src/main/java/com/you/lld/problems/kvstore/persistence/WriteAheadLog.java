package com.you.lld.problems.kvstore.persistence;

import java.io.*;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Append-only write-ahead log for durability. Each line: OP|key|value
 */
public final class WriteAheadLog {

    private final List<String> entries = Collections.synchronizedList(new ArrayList<String>());

    public void appendPut(String key, String value) {
        entries.add("PUT|" + key + "|" + value);
    }

    public void appendDelete(String key) {
        entries.add("DELETE|" + key);
    }

    public List<String> replay() {
        synchronized (entries) {
            return new ArrayList<String>(entries);
        }
    }

    public int size() {
        return entries.size();
    }
}
