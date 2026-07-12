package com.you.lld.designpatterns.behavioral;

import java.util.ArrayDeque;
import java.util.Deque;

/**
 * Command — encapsulate a request as an object so you can queue it, log it, undo it,
 * or hand it to a different invoker. Decouples invoker from receiver.
 * Use cases: undo/redo (editor), task queues, transactional batches, macro recording.
 */
public class CommandDemo {

    /* Receiver */
    static class TextDocument {
        private final StringBuilder text = new StringBuilder();
        void append(String s) { text.append(s); }
        void deleteLast(int n) { text.delete(Math.max(0, text.length() - n), text.length()); }
        public String toString() { return text.toString(); }
    }

    /* Command */
    interface Command {
        void execute();
        void undo();
    }

    static class AppendCommand implements Command {
        private final TextDocument doc;
        private final String text;
        AppendCommand(TextDocument d, String t) { doc = d; text = t; }
        public void execute() { doc.append(text); }
        public void undo() { doc.deleteLast(text.length()); }
    }

    /* Invoker */
    static class Editor {
        private final TextDocument doc;
        private final Deque<Command> history = new ArrayDeque<Command>();
        Editor(TextDocument d) { doc = d; }
        void run(Command c) { c.execute(); history.push(c); }
        void undo() { if (!history.isEmpty()) history.pop().undo(); }
    }

    public static void main(String[] args) {
        TextDocument d = new TextDocument();
        Editor e = new Editor(d);
        e.run(new AppendCommand(d, "hello "));
        e.run(new AppendCommand(d, "world"));
        System.out.println(d);
        e.undo();
        System.out.println(d);
        e.undo();
        System.out.println("[" + d + "]");
    }
}
