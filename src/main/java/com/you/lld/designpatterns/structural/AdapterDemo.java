package com.you.lld.designpatterns.structural;

/**
 * Adapter — wraps an incompatible interface so it conforms to the one the client expects.
 * Use cases: legacy library integration, third-party SDK behind a clean port, unit conversion.
 */
public class AdapterDemo {

    /* Target — what our codebase uses */
    interface PaymentProcessor {
        void pay(String customer, double amountUsd);
    }

    /* Adaptee — third-party SDK with an awkward API */
    static class LegacyStripeSdk {
        public void chargeCents(String email, long cents) {
            System.out.println("[stripe] charged " + cents + " cents to " + email);
        }
    }

    /* Adapter */
    static class StripeAdapter implements PaymentProcessor {
        private final LegacyStripeSdk sdk;
        StripeAdapter(LegacyStripeSdk sdk) { this.sdk = sdk; }
        public void pay(String customer, double amountUsd) {
            long cents = Math.round(amountUsd * 100);
            sdk.chargeCents(customer, cents);
        }
    }

    public static void main(String[] args) {
        PaymentProcessor p = new StripeAdapter(new LegacyStripeSdk());
        p.pay("alice@x.com", 29.99);
    }
}
