package com.you.lld.designpatterns.creational;

import java.util.ArrayList;
import java.util.List;

/**
 * Prototype — create new objects by cloning an existing instance instead of constructing
 * from scratch. Useful when construction is expensive (DB lookup, network call) or when
 * the concrete class is unknown at compile time.
 * Use cases: game entity spawning, document templates, A/B variant cloning.
 */
public class PrototypeDemo {

    static class Resume implements Cloneable {
        String name;
        List<String> skills;

        Resume(String name, List<String> skills) {
            this.name = name;
            this.skills = skills;
        }

        @Override
        public Resume clone() {
            // deep copy of mutable collections is critical
            return new Resume(this.name, new ArrayList<String>(this.skills));
        }

        @Override
        public String toString() {
            return name + " -> " + skills;
        }
    }

    public static void main(String[] args) {
        List<String> base = new ArrayList<String>();
        base.add("java");
        base.add("sql");
        Resume template = new Resume("template", base);

        Resume alice = template.clone();
        alice.name = "alice";
        alice.skills.add("kafka");

        Resume bob = template.clone();
        bob.name = "bob";

        System.out.println(template);
        System.out.println(alice);
        System.out.println(bob);
    }
}
