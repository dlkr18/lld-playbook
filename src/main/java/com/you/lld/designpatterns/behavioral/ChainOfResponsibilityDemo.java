package com.you.lld.designpatterns.behavioral;

/**
 * Chain of Responsibility — pass a request along a chain of handlers; each decides to
 * handle it or forward it. Decouples sender from receivers.
 * Use cases: servlet filters, middleware, auth/validation/logging pipelines, support escalation.
 */
public class ChainOfResponsibilityDemo {

    static class Request {
        final String user;
        final String body;
        final int amount;
        Request(String u, String b, int a) { user = u; body = b; amount = a; }
    }

    static abstract class Handler {
        protected Handler next;
        public Handler chain(Handler next) { this.next = next; return next; }
        public final void handle(Request r) {
            if (process(r) && next != null) next.handle(r);
        }
        /** return false to stop the chain */
        protected abstract boolean process(Request r);
    }

    static class AuthHandler extends Handler {
        protected boolean process(Request r) {
            if (r.user == null) { System.out.println("rejected: no user"); return false; }
            System.out.println("auth ok");
            return true;
        }
    }
    static class ValidationHandler extends Handler {
        protected boolean process(Request r) {
            if (r.amount <= 0) { System.out.println("rejected: bad amount"); return false; }
            System.out.println("validation ok");
            return true;
        }
    }
    static class LoggingHandler extends Handler {
        protected boolean process(Request r) {
            System.out.println("log: " + r.user + " -> " + r.amount);
            return true;
        }
    }
    static class ProcessHandler extends Handler {
        protected boolean process(Request r) {
            System.out.println("processed payment of $" + r.amount + " for " + r.user);
            return true;
        }
    }

    public static void main(String[] args) {
        Handler head = new AuthHandler();
        head.chain(new ValidationHandler()).chain(new LoggingHandler()).chain(new ProcessHandler());

        head.handle(new Request("alice", "buy", 100));
        System.out.println("---");
        head.handle(new Request(null, "buy", 100));
        System.out.println("---");
        head.handle(new Request("bob", "buy", -5));
    }
}
