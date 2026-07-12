package com.you.lld.designpatterns.structural;

/**
 * Decorator — adds responsibilities to an object dynamically by wrapping it. Favors
 * composition over a subclass explosion (Coffee + Milk + Sugar + Whip -> 16 subclasses).
 * Use cases: java.io streams (BufferedInputStream wraps FileInputStream), cache decorators,
 * Spring transactional / security wrappers, middleware chains.
 */
public class DecoratorDemo {

    interface Coffee {
        String description();
        double cost();
    }

    static class Espresso implements Coffee {
        public String description() { return "espresso"; }
        public double cost() { return 2.0; }
    }

    /* Base decorator */
    static abstract class CoffeeDecorator implements Coffee {
        protected final Coffee inner;
        CoffeeDecorator(Coffee inner) { this.inner = inner; }
    }

    static class Milk extends CoffeeDecorator {
        Milk(Coffee c) { super(c); }
        public String description() { return inner.description() + " + milk"; }
        public double cost() { return inner.cost() + 0.5; }
    }
    static class Sugar extends CoffeeDecorator {
        Sugar(Coffee c) { super(c); }
        public String description() { return inner.description() + " + sugar"; }
        public double cost() { return inner.cost() + 0.2; }
    }
    static class Whip extends CoffeeDecorator {
        Whip(Coffee c) { super(c); }
        public String description() { return inner.description() + " + whip"; }
        public double cost() { return inner.cost() + 0.7; }
    }

    public static void main(String[] args) {
        Coffee c = new Whip(new Sugar(new Milk(new Espresso())));
        System.out.println(c.description() + " = $" + c.cost());
    }
}
