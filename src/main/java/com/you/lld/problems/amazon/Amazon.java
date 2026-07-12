package com.you.lld.problems.amazon;

import com.you.lld.problems.amazon.model.Address;
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

    public String checkout(String customerId, Address address) {
        java.util.ArrayList<OrderItem> items = new java.util.ArrayList<OrderItem>();
        for (com.you.lld.problems.amazon.model.CartItem item
                : cart.getCart(customerId).getItems().values()) {
            items.add(new OrderItem(item.getProductId(), item.getProductName(),
                    item.getPrice(), item.getQuantity()));
        }
        String orderId = orders.createOrder(customerId, items, address);
        cart.clearCart(customerId);
        return orderId;
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

    public boolean cancelOrder(String orderId) {
        return orders.cancelOrder(orderId);
    }
}
