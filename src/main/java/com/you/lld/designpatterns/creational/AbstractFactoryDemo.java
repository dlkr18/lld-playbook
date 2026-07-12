package com.you.lld.designpatterns.creational;

/**
 * Abstract Factory — creates *families* of related products that must be used together.
 * Use cases: cross-platform UI toolkits (Mac vs Windows widgets), cloud SDK (AWS vs GCP).
 */
public class AbstractFactoryDemo {

    interface Button {
        void render();
    }

    interface Checkbox {
        void render();
    }

    static class MacButton implements Button {
        public void render() {
            System.out.println("Mac button");
        }
    }

    static class MacCheckbox implements Checkbox {
        public void render() {
            System.out.println("Mac checkbox");
        }
    }

    static class WinButton implements Button {
        public void render() {
            System.out.println("Win button");
        }
    }

    static class WinCheckbox implements Checkbox {
        public void render() {
            System.out.println("Win checkbox");
        }
    }

    interface UIFactory {
        Button createButton();

        Checkbox createCheckbox();
    }

    static class MacFactory implements UIFactory {
        public Button createButton() {
            return new MacButton();
        }

        public Checkbox createCheckbox() {
            return new MacCheckbox();
        }
    }

    static class WinFactory implements UIFactory {
        public Button createButton() {
            return new WinButton();
        }

        public Checkbox createCheckbox() {
            return new WinCheckbox();
        }
    }

    static class App {
        private final Button b;
        private final Checkbox c;

        App(UIFactory f) {
            this.b = f.createButton();
            this.c = f.createCheckbox();
        }

        void render() {
            b.render();
            c.render();
        }
    }

    public static void main(String[] args) {
        new App(new MacFactory()).render();
        new App(new WinFactory()).render();
    }
}
