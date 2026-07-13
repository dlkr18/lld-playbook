package com.you.lld.problems.ministore;

import com.you.lld.problems.ministore.model.Cart;
import com.you.lld.problems.ministore.model.CartLine;
import com.you.lld.problems.ministore.model.InventoryItem;
import com.you.lld.problems.ministore.model.Money;
import com.you.lld.problems.ministore.model.Order;
import com.you.lld.problems.ministore.model.OrderLine;
import com.you.lld.problems.ministore.model.Product;
import com.you.lld.problems.ministore.model.Store;
import com.you.lld.problems.ministore.model.exceptions.NotFoundException;
import com.you.lld.problems.ministore.model.exceptions.PaymentDeclinedException;
import com.you.lld.problems.ministore.model.exceptions.StoreException;
import com.you.lld.problems.ministore.service.PaymentGateway;
import com.you.lld.problems.ministore.service.PaymentRequest;
import com.you.lld.problems.ministore.service.PaymentResult;
import com.you.lld.problems.ministore.service.Repository;
import com.you.lld.problems.ministore.service.impl.InMemoryRepository;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Facade / orchestrator for the multi-tenant store platform — the class an interviewer
 * reads first. It owns the repositories and coordinates the flows; the only injected
 * dependency is the {@link PaymentGateway} (Strategy), so payment is fully pluggable.
 *
 * Tenant isolation is enforced on every access via {@link #requireProduct}: a store can
 * only ever touch products carrying its own storeId. Storage sits behind {@link Repository}.
 *
 * v1 is single-threaded by design (per the brief). The one place that would need a lock
 * under concurrency is {@link #placeOrder}'s validate-then-deduct — see INTERVIEW.md.
 */
public final class MiniStore {

    private final Repository<Store, String> stores = new InMemoryRepository<Store, String>();
    private final Repository<Product, String> products = new InMemoryRepository<Product, String>();
    private final Repository<Order, String> orders = new InMemoryRepository<Order, String>();
    private final Map<String, InventoryItem> inventory = new LinkedHashMap<String, InventoryItem>();
    private final Map<String, Cart> carts = new LinkedHashMap<String, Cart>();

    private final AtomicLong productSeq = new AtomicLong();
    private final AtomicLong orderSeq = new AtomicLong();

    private PaymentGateway paymentGateway;

    public MiniStore(PaymentGateway paymentGateway) {
        if (paymentGateway == null) throw new IllegalArgumentException("payment gateway required");
        this.paymentGateway = paymentGateway;
    }

    /** Strategy is swappable at runtime (e.g. switch providers, or a test double). */
    public void setPaymentGateway(PaymentGateway gateway) {
        if (gateway == null) throw new IllegalArgumentException("payment gateway required");
        this.paymentGateway = gateway;
    }

    // ── tenant + catalog ────────────────────────────────────────────────────────

    public Store createStore(String name) {
        String id = "store-" + (stores.findAll().size() + 1);
        Store store = new Store(id, name);
        stores.save(id, store);
        return store;
    }

    /** Add a product to a store's catalog + seed its inventory. Returns the new product. */
    public Product addProduct(String storeId, String name, Money price, int initialStock) {
        requireStore(storeId);
        String id = "prod-" + productSeq.incrementAndGet();
        Product product = new Product(id, storeId, name, price);
        products.save(id, product);
        inventory.put(id, new InventoryItem(id, storeId, initialStock));
        return product;
    }

    /** A store's catalog — ONLY its own products (tenant-scoped). */
    public List<Product> catalog(String storeId) {
        requireStore(storeId);
        List<Product> out = new ArrayList<Product>();
        for (Product p : products.findAll()) {
            if (p.storeId().equals(storeId)) out.add(p);
        }
        return out;
    }

    public int availableStock(String storeId, String productId) {
        return inventory.get(requireProduct(storeId, productId).id()).available();
    }

    public void restock(String storeId, String productId, int qty) {
        Product p = requireProduct(storeId, productId);
        inventory.get(p.id()).restock(qty);
    }

    // ── cart ──────────────────────────────────────────────────────────────────

    public void addToCart(String storeId, String customerId, String productId, int qty) {
        // requireProduct enforces the product belongs to THIS store — cross-tenant add
        // is impossible: a store-B product id simply "does not exist" for store A.
        requireProduct(storeId, productId);
        cartFor(storeId, customerId).addItem(productId, qty);
    }

    public Cart viewCart(String storeId, String customerId) {
        return cartFor(storeId, customerId);
    }

    // ── order placement (the crown jewel) ───────────────────────────────────────

    /**
     * Place an order for everything in the customer's cart at this store.
     * Flow (all-or-nothing): validate every line's stock → deduct all → charge →
     * on decline, roll the stock back and cancel; on approval, confirm and clear cart.
     */
    public Order placeOrder(String storeId, String customerId, String paymentMethod) {
        requireStore(storeId);
        Cart cart = cartFor(storeId, customerId);
        if (cart.isEmpty()) throw new StoreException("cannot place an order with an empty cart");

        // 1. Build lines + validate products belong to the store + validate stock.
        //    No mutation yet — so a shortage on line 3 never half-deducts lines 1-2.
        List<OrderLine> lines = new ArrayList<OrderLine>();
        Money total = Money.zero();
        for (CartLine cl : cart.lines()) {
            Product p = requireProduct(storeId, cl.productId());
            InventoryItem inv = inventory.get(p.id());
            if (cl.quantity() > inv.available()) {
                throw new com.you.lld.problems.ministore.model.exceptions.InsufficientInventoryException(
                    p.name(), cl.quantity(), inv.available());
            }
            OrderLine line = new OrderLine(p.id(), p.name(), p.price(), cl.quantity());
            lines.add(line);
            total = total.plus(line.lineTotal());
        }

        // 2. Deduct all. The inventory guard is the ultimate backstop against negatives.
        for (OrderLine line : lines) {
            inventory.get(line.productId()).deduct(line.quantity(), line.productName());
        }

        Order order = new Order("order-" + orderSeq.incrementAndGet(), storeId, customerId, lines, total);

        // 3. Charge via the pluggable gateway.
        PaymentResult result = paymentGateway.charge(new PaymentRequest(order.id(), total, paymentMethod));
        if (!result.approved()) {
            // roll back every deduction — stock returns to exactly its pre-order level
            for (OrderLine line : lines) {
                inventory.get(line.productId()).restock(line.quantity());
            }
            order.cancel();
            orders.save(order.id(), order);
            throw new PaymentDeclinedException(order.id(), result.declineReason());
        }

        // 4. Success — confirm, persist, empty the cart.
        order.confirm(result.transactionId());
        orders.save(order.id(), order);
        cart.clear();
        return order;
    }

    public Order getOrder(String orderId) {
        Order o = orders.findById(orderId);
        if (o == null) throw new NotFoundException("order not found: " + orderId);
        return o;
    }

    // ── internals ───────────────────────────────────────────────────────────────

    private void requireStore(String storeId) {
        if (stores.findById(storeId) == null) throw new NotFoundException("store not found: " + storeId);
    }

    /** The single choke point that enforces tenant isolation on product access. */
    private Product requireProduct(String storeId, String productId) {
        requireStore(storeId);
        Product p = products.findById(productId);
        if (p == null || !p.storeId().equals(storeId)) {
            throw new NotFoundException("product '" + productId + "' not found in store " + storeId);
        }
        return p;
    }

    private Cart cartFor(String storeId, String customerId) {
        String key = storeId + ":" + customerId;
        Cart cart = carts.get(key);
        if (cart == null) {
            cart = new Cart(storeId, customerId);
            carts.put(key, cart);
        }
        return cart;
    }
}
