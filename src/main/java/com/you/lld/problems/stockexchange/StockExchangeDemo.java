package com.you.lld.problems.stockexchange;

import com.you.lld.problems.stockexchange.impl.OrderMatchingEngine;
import com.you.lld.problems.stockexchange.model.*;

import java.util.List;

/**
 * Demo: Stock Exchange with order matching, price-time priority,
 * partial fills, cancellation.
 */
public class StockExchangeDemo {

    public static void main(String[] args) {
        System.out.println("=== Stock Exchange Demo ===\n");

        OrderMatchingEngine engine = new OrderMatchingEngine();

        // --- Scenario 1: Basic matching ---
        System.out.println("--- Scenario 1: Basic buy/sell matching ---");
        String sellId1 = engine.placeOrder(
            new Order("AAPL", "seller1", OrderType.SELL, 150.00, 100));
        System.out.println("Placed sell: 100 AAPL @ $150.00 -> " + sellId1);

        String buyId1 = engine.placeOrder(
            new Order("AAPL", "buyer1", OrderType.BUY, 151.00, 100));
        System.out.println("Placed buy:  100 AAPL @ $151.00 -> " + buyId1);

        // Should have matched at sell price ($150)
        List<Trade> aaplTrades = engine.getTrades("AAPL");
        System.out.println("Trades executed: " + aaplTrades.size());
        if (!aaplTrades.isEmpty()) {
            Trade t = aaplTrades.get(0);
            System.out.println("  Trade: " + t.getQuantity() + " shares @ $" + t.getPrice()
                + " = $" + t.getTotalValue());
        }
        System.out.println("Buy order status: " + engine.getOrder(buyId1).getStatus());
        System.out.println("Sell order status: " + engine.getOrder(sellId1).getStatus());

        // --- Scenario 2: Partial fill ---
        System.out.println("\n--- Scenario 2: Partial fill ---");
        engine.placeOrder(new Order("GOOG", "seller2", OrderType.SELL, 2800.00, 50));
        engine.placeOrder(new Order("GOOG", "buyer2", OrderType.BUY, 2800.00, 30));

        List<Trade> googTrades = engine.getTrades("GOOG");
        System.out.println("GOOG trades: " + googTrades.size());
        if (!googTrades.isEmpty()) {
            System.out.println("  Partial fill: " + googTrades.get(0).getQuantity() + " shares");
        }
        List<Order> openGoog = engine.getOpenOrders("GOOG");
        System.out.println("Open GOOG orders: " + openGoog.size());
        for (Order o : openGoog) {
            System.out.println("  " + o.getType() + " remaining: " + o.getRemainingQuantity());
        }

        // --- Scenario 3: Order book depth ---
        System.out.println("\n--- Scenario 3: Multiple orders at different prices ---");
        engine.placeOrder(new Order("TSLA", "s1", OrderType.SELL, 250.00, 100));
        engine.placeOrder(new Order("TSLA", "s2", OrderType.SELL, 248.00, 50));
        engine.placeOrder(new Order("TSLA", "s3", OrderType.SELL, 252.00, 75));

        System.out.println("Best ask (lowest sell): $" + engine.getBestAsk("TSLA"));

        // This buy at $249 should match with sell at $248
        engine.placeOrder(new Order("TSLA", "b1", OrderType.BUY, 249.00, 50));
        List<Trade> tslaTrades = engine.getTrades("TSLA");
        System.out.println("TSLA trades: " + tslaTrades.size());
        for (Trade t : tslaTrades) {
            System.out.println("  " + t.getQuantity() + " @ $" + t.getPrice());
        }

        // --- Scenario 4: Cancel order ---
        System.out.println("\n--- Scenario 4: Order cancellation ---");
        String cancelTarget = engine.placeOrder(
            new Order("MSFT", "user5", OrderType.BUY, 380.00, 200));
        System.out.println("Placed buy MSFT: " + cancelTarget);
        System.out.println("Status: " + engine.getOrder(cancelTarget).getStatus());
        boolean cancelled = engine.cancelOrder(cancelTarget);
        System.out.println("Cancelled: " + cancelled);
        System.out.println("Status: " + engine.getOrder(cancelTarget).getStatus());

        // --- Scenario 5: No match ---
        System.out.println("\n--- Scenario 5: No match (bid < ask) ---");
        engine.placeOrder(new Order("NFLX", "s4", OrderType.SELL, 600.00, 100));
        engine.placeOrder(new Order("NFLX", "b4", OrderType.BUY, 590.00, 100));
        System.out.println("NFLX trades: " + engine.getTrades("NFLX").size());
        System.out.println("Best bid: $" + engine.getBestBid("NFLX"));
        System.out.println("Best ask: $" + engine.getBestAsk("NFLX"));

        // --- Scenario 6: User order history ---
        System.out.println("\n--- Scenario 6: User order history ---");
        List<Order> user5Orders = engine.getUserOrders("user5");
        System.out.println("user5 orders: " + user5Orders.size());
        for (Order o : user5Orders) {
            System.out.println("  " + o.getId() + " " + o.getSymbol() + " " 
                + o.getType() + " " + o.getStatus());
        }

        System.out.println("\n=== Demo complete ===");
    }
}
