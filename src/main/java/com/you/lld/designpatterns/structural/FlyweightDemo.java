package com.you.lld.designpatterns.structural;

import java.util.HashMap;
import java.util.Map;

/**
 * Flyweight — share immutable intrinsic state across many objects to cut memory.
 * Split state into (intrinsic = shared, immutable) and (extrinsic = per-use, passed in).
 * Use cases: text editor character glyphs, game particle textures, Integer.valueOf cache.
 */
public class FlyweightDemo {

    /* Intrinsic / shared state */
    static class TreeType {
        final String species; final String color; final String texture;
        TreeType(String s, String c, String t) { species = s; color = c; texture = t; }
        void render(int x, int y) {
            System.out.println("draw " + species + "(" + color + ") at (" + x + "," + y + ")");
        }
    }

    /* Flyweight factory — reuses TreeType instances */
    static class TreeTypeFactory {
        private static final Map<String, TreeType> pool = new HashMap<String, TreeType>();
        static TreeType get(String species, String color, String texture) {
            String key = species + "|" + color + "|" + texture;
            TreeType t = pool.get(key);
            if (t == null) {
                t = new TreeType(species, color, texture);
                pool.put(key, t);
                System.out.println("  (new TreeType cached: " + key + ")");
            }
            return t;
        }
        static int size() { return pool.size(); }
    }

    /* Extrinsic state is held outside the flyweight */
    static class Tree {
        final int x, y;
        final TreeType type;
        Tree(int x, int y, TreeType t) { this.x = x; this.y = y; this.type = t; }
        void render() { type.render(x, y); }
    }

    public static void main(String[] args) {
        Tree[] forest = new Tree[] {
            new Tree(1, 2, TreeTypeFactory.get("oak",  "green", "rough")),
            new Tree(5, 8, TreeTypeFactory.get("oak",  "green", "rough")),
            new Tree(3, 4, TreeTypeFactory.get("pine", "darkgreen", "smooth")),
            new Tree(9, 1, TreeTypeFactory.get("oak",  "green", "rough")),
        };
        for (Tree t : forest) t.render();
        System.out.println("trees=" + forest.length + ", unique types=" + TreeTypeFactory.size());
    }
}
