package com.you.lld.designpatterns.behavioral;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Strategy — defines a family of interchangeable algorithms behind a common interface.
 * Caller picks at runtime, no if/else explosion. Different from State: strategies don't
 * transition between themselves.
 * Use cases: pricing rules, sorting/compression algorithm, parking-spot allocation,
 * rate-limiter algorithm (token bucket vs leaky bucket vs sliding window).
 */
public class StrategyDemo {

    interface PricingStrategy {
        double price(double base);
    }

    static class RegularPricing implements PricingStrategy {
        public double price(double base) {
            return base;
        }
    }

    static class HolidayPricing implements PricingStrategy {
        public double price(double base) {
            return base * 1.5;
        }
    }

    static class MemberPricing implements PricingStrategy {
        public double price(double base) {
            return base * 0.8;
        }
    }

    static class Checkout {
        private PricingStrategy strategy;

        Checkout(PricingStrategy s) {
            this.strategy = s;
        }

        void setStrategy(PricingStrategy s) {
            this.strategy = s;
        }

        double total(List<Double> items) {
            double sum = 0;
            for (Double i : items) sum += i;
            return strategy.price(sum);
        }
    }

    public static void main(String[] args) {
        List<Double> items = Arrays.asList(10.0, 20.0, 30.0);
        Checkout c = new Checkout(new RegularPricing());
        System.out.println("regular: " + c.total(items));
        c.setStrategy(new HolidayPricing());
        System.out.println("holiday: " + c.total(items));
        c.setStrategy(new MemberPricing());
        System.out.println("member: " + c.total(items));
    }
}
