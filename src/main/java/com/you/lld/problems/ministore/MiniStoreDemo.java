package com.you.lld.problems.ministore;

import com.you.lld.problems.ministore.model.Money;
import com.you.lld.problems.ministore.model.Order;
import com.you.lld.problems.ministore.model.OrderLine;
import com.you.lld.problems.ministore.model.Product;
import com.you.lld.problems.ministore.model.Store;
import com.you.lld.problems.ministore.model.exceptions.InsufficientInventoryException;
import com.you.lld.problems.ministore.model.exceptions.NotFoundException;
import com.you.lld.problems.ministore.model.exceptions.PaymentDeclinedException;
import com.you.lld.problems.ministore.service.impl.ApprovingPaymentGateway;
import com.you.lld.problems.ministore.service.impl.ThresholdPaymentGateway;

/**
 * End-to-end demo of the multi-tenant store:
 *   1. Two tenants, each with its own isolated catalog
 *   2. Cart + successful order (inventory deducted exactly)
 *   3. Oversell prevention (stock never goes negative)
 *   4. Tenant isolation (store A can't touch store B's product)
 *   5. Payment declined -> inventory rolled back, order CANCELLED
 *   6. Pluggable payment Strategy swapped at runtime
 */
public class MiniStoreDemo {

    public static void main(String[] args) {
        MiniStore platform = new MiniStore(new ApprovingPaymentGateway());

        header("1. Multi-tenant setup — two stores, separate catalogs");
        Store acme = platform.createStore("Acme Coffee");
        Store globex = platform.createStore("Globex Books");
        Product beans = platform.addProduct(acme.id(), "Ethiopia Beans 1kg", Money.of("24.00"), 10);
        Product mug = platform.addProduct(acme.id(), "Ceramic Mug", Money.of("12.50"), 5);
        Product novel = platform.addProduct(globex.id(), "Dune (Paperback)", Money.of("9.99"), 3);
        System.out.println("   " + acme + " catalog: " + names(platform, acme.id()));
        System.out.println("   " + globex + " catalog: " + names(platform, globex.id()));

        header("2. Cart + successful order");
        String alice = "cust-alice";
        platform.addToCart(acme.id(), alice, beans.id(), 2);
        platform.addToCart(acme.id(), alice, mug.id(), 1);
        System.out.println("   beans stock before: " + platform.availableStock(acme.id(), beans.id()));
        Order o1 = platform.placeOrder(acme.id(), alice, "CARD");
        System.out.println("   placed: " + o1);
        for (OrderLine l : o1.lines()) System.out.println("     - " + l);
        System.out.println("   beans stock after:  " + platform.availableStock(acme.id(), beans.id()) + "  (10 - 2)");
        System.out.println("   cart now empty:     " + platform.viewCart(acme.id(), alice).isEmpty());

        header("3. Oversell prevention — order more than in stock");
        String bob = "cust-bob";
        platform.addToCart(acme.id(), bob, mug.id(), 99);   // only 4 mugs left
        safe("place oversized order", () -> platform.placeOrder(acme.id(), bob, "CARD"));
        System.out.println("   mug stock unchanged: " + platform.availableStock(acme.id(), mug.id()) + "  (still 4, no partial deduct)");

        header("4. Tenant isolation — Acme customer tries to buy a Globex product");
        safe("add cross-tenant product to cart",
            () -> platform.addToCart(acme.id(), alice, novel.id(), 1));
        System.out.println("   -> Globex's 'Dune' simply does not exist for the Acme tenant");

        header("5. Payment declined — inventory rolls back, order CANCELLED");
        platform.setPaymentGateway(new ThresholdPaymentGateway(Money.of("20.00"))); // declines > $20
        String carol = "cust-carol";
        platform.addToCart(acme.id(), carol, beans.id(), 2);   // 2 x $24 = $48 > $20 -> declined
        System.out.println("   beans stock before attempt: " + platform.availableStock(acme.id(), beans.id()));
        safe("place order that will be declined", () -> platform.placeOrder(acme.id(), carol, "CARD"));
        System.out.println("   beans stock after decline:  " + platform.availableStock(acme.id(), beans.id()) + "  (rolled back — unchanged)");

        header("6. Swap payment Strategy back to approving — same cart now succeeds");
        platform.setPaymentGateway(new ApprovingPaymentGateway());
        Order o2 = platform.placeOrder(acme.id(), carol, "CARD");
        System.out.println("   placed: " + o2);

        System.out.println("\n=== demo complete ===");
    }

    private static String names(MiniStore p, String storeId) {
        StringBuilder sb = new StringBuilder("[");
        boolean first = true;
        for (Product pr : p.catalog(storeId)) {
            if (!first) sb.append(", ");
            sb.append(pr.name());
            first = false;
        }
        return sb.append("]").toString();
    }

    private static void header(String msg) {
        System.out.println();
        System.out.println("-- " + msg + " --");
    }

    @FunctionalInterface
    private interface ThrowingRunnable { void run(); }

    private static void safe(String label, ThrowingRunnable r) {
        try {
            r.run();
            System.out.println("   " + label + ": (no exception — unexpected)");
        } catch (InsufficientInventoryException | NotFoundException | PaymentDeclinedException e) {
            System.out.println("   " + label + " -> " + e.getClass().getSimpleName() + ": " + e.getMessage());
        }
    }
}
