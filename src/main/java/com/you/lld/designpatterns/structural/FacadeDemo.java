package com.you.lld.designpatterns.structural;

/**
 * Facade — a single high-level interface over a complex subsystem. Reduces client
 * coupling and presents an easy-to-use API while the underlying parts stay decoupled.
 * Use cases: order placement (inventory + payment + shipping + notification),
 * media library (codec + filter + buffer), startup orchestration.
 */
public class FacadeDemo {

    static class InventoryService {
        boolean reserve(String sku, int qty) { System.out.println("reserved " + qty + " x " + sku); return true; }
    }
    static class PaymentService {
        boolean charge(String userId, double amount) { System.out.println("charged " + userId + " $" + amount); return true; }
    }
    static class ShippingService {
        String dispatch(String userId, String sku) { String id = "TRK-123"; System.out.println("shipped " + sku + " -> " + id); return id; }
    }
    static class NotificationService {
        void notify(String userId, String trackingId) { System.out.println("notified " + userId + " tracking=" + trackingId); }
    }

    /* Facade */
    static class OrderFacade {
        private final InventoryService inv = new InventoryService();
        private final PaymentService pay = new PaymentService();
        private final ShippingService ship = new ShippingService();
        private final NotificationService notif = new NotificationService();

        public boolean placeOrder(String userId, String sku, int qty, double amount) {
            if (!inv.reserve(sku, qty)) return false;
            if (!pay.charge(userId, amount)) return false;
            String trk = ship.dispatch(userId, sku);
            notif.notify(userId, trk);
            return true;
        }
    }

    public static void main(String[] args) {
        new OrderFacade().placeOrder("u1", "BOOK-42", 1, 19.99);
    }
}
