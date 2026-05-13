package com.you.lld.designpatterns.structural;

import java.util.ArrayList;
import java.util.List;

/**
 * Composite — treat individual objects and groups of objects uniformly via a common interface.
 * Use cases: filesystem (file vs directory), UI tree, org hierarchies, expression trees.
 */
public class CompositeDemo {

    interface FsNode {
        String name();
        long size();           // bytes
        void print(String indent);
    }

    static class File implements FsNode {
        private final String name;
        private final long size;
        File(String name, long size) { this.name = name; this.size = size; }
        public String name() { return name; }
        public long size() { return size; }
        public void print(String indent) { System.out.println(indent + "- " + name + " (" + size + "b)"); }
    }

    static class Directory implements FsNode {
        private final String name;
        private final List<FsNode> children = new ArrayList<FsNode>();
        Directory(String name) { this.name = name; }
        public Directory add(FsNode n) { children.add(n); return this; }
        public String name() { return name; }
        public long size() {
            long total = 0;
            for (FsNode c : children) total += c.size();
            return total;
        }
        public void print(String indent) {
            System.out.println(indent + "+ " + name + "/ (" + size() + "b)");
            for (FsNode c : children) c.print(indent + "  ");
        }
    }

    public static void main(String[] args) {
        Directory root = new Directory("root")
                .add(new File("readme.md", 200))
                .add(new Directory("src")
                        .add(new File("Main.java", 800))
                        .add(new File("Util.java", 400)))
                .add(new Directory("docs").add(new File("api.pdf", 5000)));
        root.print("");
    }
}
