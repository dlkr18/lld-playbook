package com.you.lld.designpatterns.behavioral;

/**
 * State — an object's behavior changes when its internal state changes; looks like the
 * object changed class. Replaces large switch/if chains with polymorphism. Transitions
 * live inside state classes.
 * Use cases: vending machine, ATM, order lifecycle (CREATED -> PAID -> SHIPPED -> DELIVERED),
 * TCP connection.
 */
public class StateDemo {

    /* Context */
    static class TurnstileContext {
        State state = new LockedState();
        int coins = 0;
        void coin() { state.coin(this); }
        void push() { state.push(this); }
    }

    interface State {
        void coin(TurnstileContext c);
        void push(TurnstileContext c);
    }

    static class LockedState implements State {
        public void coin(TurnstileContext c) {
            c.coins++;
            System.out.println("locked -> unlocked (coin inserted, total=" + c.coins + ")");
            c.state = new UnlockedState();
        }
        public void push(TurnstileContext c) {
            System.out.println("locked: push denied");
        }
    }

    static class UnlockedState implements State {
        public void coin(TurnstileContext c) {
            c.coins++;
            System.out.println("unlocked: extra coin (total=" + c.coins + ")");
        }
        public void push(TurnstileContext c) {
            System.out.println("unlocked -> locked (passed through)");
            c.state = new LockedState();
        }
    }

    public static void main(String[] args) {
        TurnstileContext t = new TurnstileContext();
        t.push();
        t.coin();
        t.coin();
        t.push();
        t.push();
    }
}
