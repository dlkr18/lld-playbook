package com.you.lld.designpatterns.behavioral;

import java.util.ArrayList;
import java.util.List;

/**
 * Observer — one subject notifies many observers when its state changes. Push or pull.
 * Use cases: event bus, UI bindings, stock ticker, pub/sub within a JVM, listeners.
 */
public class ObserverDemo {

    interface PriceObserver {
        void onPriceChange(String symbol, double price);
    }

    static class StockTicker {
        private final List<PriceObserver> observers = new ArrayList<PriceObserver>();
        public void subscribe(PriceObserver o) { observers.add(o); }
        public void unsubscribe(PriceObserver o) { observers.remove(o); }
        public void publish(String symbol, double price) {
            for (PriceObserver o : observers) o.onPriceChange(symbol, price);
        }
    }

    static class AlertObserver implements PriceObserver {
        private final double threshold;
        AlertObserver(double t) { threshold = t; }
        public void onPriceChange(String s, double p) {
            if (p >= threshold) System.out.println("ALERT " + s + " hit " + p);
        }
    }

    static class LogObserver implements PriceObserver {
        public void onPriceChange(String s, double p) { System.out.println("log " + s + "=" + p); }
    }

    public static void main(String[] args) {
        StockTicker t = new StockTicker();
        t.subscribe(new LogObserver());
        t.subscribe(new AlertObserver(150));
        t.publish("AAPL", 145);
        t.publish("AAPL", 155);
    }
}
