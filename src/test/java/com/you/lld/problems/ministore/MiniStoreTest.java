package com.you.lld.problems.ministore;

import com.you.lld.problems.ministore.model.Money;
import com.you.lld.problems.ministore.model.Order;
import com.you.lld.problems.ministore.model.OrderStatus;
import com.you.lld.problems.ministore.model.Product;
import com.you.lld.problems.ministore.model.Store;
import com.you.lld.problems.ministore.model.exceptions.InsufficientInventoryException;
import com.you.lld.problems.ministore.model.exceptions.NotFoundException;
import com.you.lld.problems.ministore.model.exceptions.PaymentDeclinedException;
import com.you.lld.problems.ministore.model.exceptions.StoreException;
import com.you.lld.problems.ministore.service.impl.ApprovingPaymentGateway;
import com.you.lld.problems.ministore.service.impl.ThresholdPaymentGateway;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class MiniStoreTest {

    private MiniStore platform;
    private Store acme;
    private Store globex;
    private Product beans;   // acme, $24, stock 10
    private Product mug;     // acme, $12.50, stock 5
    private Product novel;   // globex, $9.99, stock 3

    @BeforeEach
    void setUp() {
        platform = new MiniStore(new ApprovingPaymentGateway());
        acme = platform.createStore("Acme");
        globex = platform.createStore("Globex");
        beans = platform.addProduct(acme.id(), "Beans", Money.of("24.00"), 10);
        mug = platform.addProduct(acme.id(), "Mug", Money.of("12.50"), 5);
        novel = platform.addProduct(globex.id(), "Dune", Money.of("9.99"), 3);
    }

    // ── multi-tenancy ──────────────────────────────────────────────────────────

    @Test
    void catalogsAreIsolatedPerStore() {
        assertEquals(2, platform.catalog(acme.id()).size());
        assertEquals(1, platform.catalog(globex.id()).size());
    }

    @Test
    void storeCannotSeeAnotherStoresProduct() {
        // novel belongs to globex; asking as acme => not found (isolation == invisibility)
        assertThrows(NotFoundException.class,
            () -> platform.availableStock(acme.id(), novel.id()));
    }

    @Test
    void cannotAddCrossTenantProductToCart() {
        assertThrows(NotFoundException.class,
            () -> platform.addToCart(acme.id(), "c1", novel.id(), 1));
    }

    @Test
    void unknownStoreIsRejected() {
        assertThrows(NotFoundException.class,
            () -> platform.addProduct("store-999", "x", Money.of("1.00"), 1));
    }

    // ── inventory correctness ───────────────────────────────────────────────────

    @Test
    void orderDeductsInventoryExactly() {
        platform.addToCart(acme.id(), "c1", beans.id(), 3);
        platform.placeOrder(acme.id(), "c1", "CARD");
        assertEquals(7, platform.availableStock(acme.id(), beans.id()));
    }

    @Test
    void oversellIsRejectedAndStockUnchanged() {
        platform.addToCart(acme.id(), "c1", mug.id(), 6); // only 5
        assertThrows(InsufficientInventoryException.class,
            () -> platform.placeOrder(acme.id(), "c1", "CARD"));
        assertEquals(5, platform.availableStock(acme.id(), mug.id()));
    }

    @Test
    void multiLineOrderDoesNotPartiallyDeductWhenOneLineIsShort() {
        // beans ok (2 of 10), mug short (99 of 5) -> whole order fails, beans untouched
        platform.addToCart(acme.id(), "c1", beans.id(), 2);
        platform.addToCart(acme.id(), "c1", mug.id(), 99);
        assertThrows(InsufficientInventoryException.class,
            () -> platform.placeOrder(acme.id(), "c1", "CARD"));
        assertEquals(10, platform.availableStock(acme.id(), beans.id()));
        assertEquals(5, platform.availableStock(acme.id(), mug.id()));
    }

    @Test
    void inventoryNeverGoesNegativeEvenAcrossSequentialOrders() {
        for (int i = 0; i < 10; i++) {
            platform.addToCart(acme.id(), "c" + i, beans.id(), 1);
            platform.placeOrder(acme.id(), "c" + i, "CARD");
        }
        assertEquals(0, platform.availableStock(acme.id(), beans.id()));
        platform.addToCart(acme.id(), "c-last", beans.id(), 1);
        assertThrows(InsufficientInventoryException.class,
            () -> platform.placeOrder(acme.id(), "c-last", "CARD"));
        assertEquals(0, platform.availableStock(acme.id(), beans.id())); // never -1
    }

    // ── order + cart ──────────────────────────────────────────────────────────

    @Test
    void orderTotalIsSumOfLines() {
        platform.addToCart(acme.id(), "c1", beans.id(), 2); // 48.00
        platform.addToCart(acme.id(), "c1", mug.id(), 1);   // 12.50
        Order o = platform.placeOrder(acme.id(), "c1", "CARD");
        assertEquals(Money.of("60.50"), o.total());
        assertEquals(OrderStatus.CONFIRMED, o.status());
    }

    @Test
    void successfulOrderEmptiesTheCart() {
        platform.addToCart(acme.id(), "c1", beans.id(), 1);
        platform.placeOrder(acme.id(), "c1", "CARD");
        assertTrue(platform.viewCart(acme.id(), "c1").isEmpty());
    }

    @Test
    void emptyCartCannotBeOrdered() {
        assertThrows(StoreException.class,
            () -> platform.placeOrder(acme.id(), "nobody", "CARD"));
    }

    @Test
    void addingSameProductTwiceMergesQuantity() {
        platform.addToCart(acme.id(), "c1", beans.id(), 2);
        platform.addToCart(acme.id(), "c1", beans.id(), 3);
        platform.placeOrder(acme.id(), "c1", "CARD");
        assertEquals(5, platform.availableStock(acme.id(), beans.id())); // 10 - 5
    }

    // ── pluggable payment ───────────────────────────────────────────────────────

    @Test
    void declinedPaymentRollsBackInventoryAndCancelsOrder() {
        platform.setPaymentGateway(new ThresholdPaymentGateway(Money.of("20.00")));
        platform.addToCart(acme.id(), "c1", beans.id(), 2); // $48 > $20 -> declined
        PaymentDeclinedException ex = assertThrows(PaymentDeclinedException.class,
            () -> platform.placeOrder(acme.id(), "c1", "CARD"));
        assertEquals(10, platform.availableStock(acme.id(), beans.id())); // rolled back
        assertEquals(OrderStatus.CANCELLED, platform.getOrder(ex.orderId()).status());
    }

    @Test
    void swappingGatewayChangesOutcome() {
        platform.setPaymentGateway(new ThresholdPaymentGateway(Money.of("20.00")));
        platform.addToCart(acme.id(), "c1", beans.id(), 2);
        assertThrows(PaymentDeclinedException.class,
            () -> platform.placeOrder(acme.id(), "c1", "CARD"));
        // swap to approving; re-add and retry
        platform.setPaymentGateway(new ApprovingPaymentGateway());
        platform.addToCart(acme.id(), "c1", beans.id(), 2);
        Order o = platform.placeOrder(acme.id(), "c1", "CARD");
        assertEquals(OrderStatus.CONFIRMED, o.status());
    }
}
