package com.you.lld.problems.ministore.model;

/** A tenant. Every product, cart and order is scoped to exactly one Store. */
public final class Store {

    private final String id;
    private final String name;

    public Store(String id, String name) {
        if (id == null || id.trim().isEmpty()) throw new IllegalArgumentException("store id required");
        if (name == null || name.trim().isEmpty()) throw new IllegalArgumentException("store name required");
        this.id = id;
        this.name = name;
    }

    public String id() { return id; }
    public String name() { return name; }

    @Override
    public String toString() { return "Store{" + id + ", " + name + "}"; }
}
