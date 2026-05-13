package com.you.lld.designpatterns.behavioral;

import java.util.ArrayDeque;
import java.util.Deque;

/**
 * Memento — capture an object's internal state into an opaque snapshot so it can be
 * restored later, without exposing the object's internals.
 * Use cases: undo/redo, transactional rollback, checkpoint/restore, save game.
 */
public class MementoDemo {

    /* Memento — opaque to the outside world */
    public static final class EditorMemento {
        private final String text;
        private final int cursor;
        private EditorMemento(String text, int cursor) { this.text = text; this.cursor = cursor; }
    }

    /* Originator */
    static class Editor {
        private String text = "";
        private int cursor = 0;

        void type(String s) { text = text.substring(0, cursor) + s + text.substring(cursor); cursor += s.length(); }
        EditorMemento save() { return new EditorMemento(text, cursor); }
        void restore(EditorMemento m) { this.text = m.text; this.cursor = m.cursor; }
        public String toString() { return "\"" + text + "\" cursor=" + cursor; }
    }

    /* Caretaker */
    static class History {
        private final Deque<EditorMemento> stack = new ArrayDeque<EditorMemento>();
        void push(EditorMemento m) { stack.push(m); }
        EditorMemento pop() { return stack.pop(); }
        boolean isEmpty() { return stack.isEmpty(); }
    }

    public static void main(String[] args) {
        Editor e = new Editor();
        History h = new History();
        h.push(e.save()); e.type("hello ");
        h.push(e.save()); e.type("world");
        System.out.println(e);
        e.restore(h.pop()); System.out.println(e);
        e.restore(h.pop()); System.out.println(e);
    }
}
