package com.you.lld.problems.amazon;

import com.you.lld.problems.amazon.exceptions.EmptyCartException;
import com.you.lld.problems.amazon.exceptions.InsufficientStockException;
import com.you.lld.problems.amazon.exceptions.OrderNotFoundException;
import com.you.lld.problems.amazon.exceptions.ProductNotFoundException;
import com.you.lld.problems.amazon.model.Address;
import com.you.lld.problems.amazon.model.CartItem;
import com.you.lld.problems.amazon.model.Order;
import com.you.lld.problems.amazon.model.OrderItem;
import com.you.lld.problems.amazon.model.Product;
import com.you.lld.problems.amazon.model.Review;
import com.you.lld.problems.amazon.service.CartService;
import com.you.lld.problems.amazon.service.OrderService;
import com.you.lld.problems.amazon.service.ProductService;
import com.you.lld.problems.amazon.service.impl.CartServiceImpl;
import com.you.lld.problems.amazon.service.impl.OrderServiceImpl;
import com.you.lld.problems.amazon.service.impl.ProductServiceImpl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

/** Facade for e-commerce — catalog, cart, checkout, order lifecycle. */
public class Amazon {
    private final ProductService products;
    private final CartService cart;
    private final OrderService orders;

    public Amazon() {
        ProductServiceImpl productService = new ProductServiceImpl();
        this.products = productService;
        this.cart = new CartServiceImpl(productService);
        this.orders = new OrderServiceImpl();
    }

    public void addProduct(Product product) {
        products.addProduct(product);
    }

    public List<Product> searchProducts(String query) {
        return products.searchProducts(query);
    }

    public void addToCart(String customerId, String productId, int quantity) {
        cart.addToCart(customerId, productId, quantity);
    }

    /**
     * Places an order for everything in the customer's cart.
     *
     * <p>Stock is reserved <b>before</b> the order exists, all-or-nothing: if any
     * line cannot be satisfied, every reservation already taken is released and no
     * order is created. Without this the checkout was a pure read — 100 concurrent
     * buyers could each place an order against a single unit of stock.
     */
    public String checkout(String customerId, Address address) {
        Collection<CartItem> cartItems = cart.getCart(customerId).getItems().values();
        if (cartItems.isEmpty()) {
            throw new EmptyCartException("Cannot check out an empty cart: " + customerId);
        }

        List<OrderItem> items = new ArrayList<OrderItem>();
        List<CartItem> reserved = new ArrayList<CartItem>();
        try {
            for (CartItem item : cartItems) {
                Product product = products.getProduct(item.getProductId());
                if (product == null) {
                    throw new ProductNotFoundException("Product no longer available: " + item.getProductId());
                }
                if (!product.tryReserve(item.getQuantity())) {
                    throw new InsufficientStockException(
                            "Insufficient stock for " + product.getName() + ": requested "
                                    + item.getQuantity() + ", available " + product.getStockQuantity());
                }
                reserved.add(item);
                items.add(new OrderItem(item.getProductId(), item.getProductName(),
                        item.getPrice(), item.getQuantity()));
            }
        } catch (RuntimeException e) {
            releaseAll(reserved);
            throw e;
        }

        String orderId = orders.createOrder(customerId, items, address);
        cart.clearCart(customerId);
        return orderId;
    }

    private void releaseAll(List<CartItem> reserved) {
        for (CartItem item : reserved) {
            Product product = products.getProduct(item.getProductId());
            if (product != null) {
                product.releaseStock(item.getQuantity());
            }
        }
    }

    public void addReview(String productId, Review review) {
        products.addReview(productId, review);
    }

    public Order getOrder(String orderId) {
        return orders.getOrder(orderId);
    }

    public void confirmOrder(String orderId, String paymentId) {
        orders.confirmOrder(orderId, paymentId);
    }

    public void shipOrder(String orderId, String trackingNumber) {
        orders.shipOrder(orderId, trackingNumber);
    }

    public void deliverOrder(String orderId) {
        orders.deliverOrder(orderId);
    }

    /** Cancels the order and returns its reserved stock to the catalog. */
    public boolean cancelOrder(String orderId) {
        Order order = orders.getOrder(orderId);
        if (order == null) {
            throw new OrderNotFoundException("Order not found: " + orderId);
        }
        boolean cancelled = orders.cancelOrder(orderId);
        if (cancelled) {
            for (OrderItem item : order.getItems()) {
                Product product = products.getProduct(item.getProductId());
                if (product != null) {
                    product.releaseStock(item.getQuantity());
                }
            }
        }
        return cancelled;
    }
}
