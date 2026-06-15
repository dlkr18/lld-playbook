package com.you.lld.problems.stockexchange;

import com.you.lld.problems.stockexchange.model.Order;
import com.you.lld.problems.stockexchange.model.OrderType;
import com.you.lld.problems.stockexchange.model.Trade;

import java.util.List;

/**
 * Demo: order book heaps, price-time priority, partial fills, cancellation.
 */
public class StockExchangeDemo {

    public static void main(String[] args) {
        System.out.println("=== Stock Exchange Demo ===\n");
        StockExchange exchange = new StockExchange();

        System.out.println("--- Scenario 1: Full match ---");
        String sellId = exchange.sell("AAPL", "seller1", 150.00, 100);
        String buyId = exchange.buy("AAPL", "buyer1", 151.00, 100);
        printTrade(exchange.trades("AAPL"));
        System.out.println("Buy status: " + exchange.order(buyId).getStatus());
        System.out.println("Sell status: " + exchange.order(sellId).getStatus());

        System.out.println("\n--- Scenario 2: Partial fill ---");
        exchange.sell("GOOG", "seller2", 2800.00, 50);
        exchange.buy("GOOG", "buyer2", 2800.00, 30);
        printTrade(exchange.trades("GOOG"));
        for (Order o : exchange.openOrders("GOOG")) {
            System.out.println("  Open " + o.getType() + " remaining: " + o.getRemainingQuantity()
                    + " status=" + o.getStatus());
        }

        System.out.println("\n--- Scenario 3: Best price wins ---");
        exchange.sell("TSLA", "s1", 250.00, 100);
        exchange.sell("TSLA", "s2", 248.00, 50);
        exchange.sell("TSLA", "s3", 252.00, 75);
        System.out.println("Best ask: $" + exchange.bestAsk("TSLA"));
        exchange.buy("TSLA", "b1", 249.00, 50);
        for (Trade t : exchange.trades("TSLA")) {
            System.out.println("  Trade: " + t.getQuantity() + " @ $" + t.getPrice());
        }

        System.out.println("\n--- Scenario 4: Cancellation ---");
        String cancelId = exchange.buy("MSFT", "user5", 380.00, 200);
        System.out.println("Before cancel: " + exchange.order(cancelId).getStatus());
        System.out.println("Cancelled: " + exchange.cancel(cancelId));
        System.out.println("After cancel: " + exchange.order(cancelId).getStatus());

        System.out.println("\n--- Scenario 5: No match (bid < ask) ---");
        exchange.sell("NFLX", "s4", 600.00, 100);
        exchange.buy("NFLX", "b4", 590.00, 100);
        System.out.println("Trades: " + exchange.trades("NFLX").size());
        System.out.println("Best bid: $" + exchange.bestBid("NFLX"));
        System.out.println("Best ask: $" + exchange.bestAsk("NFLX"));

        System.out.println("\n=== Demo complete ===");
    }

    private static void printTrade(List<Trade> trades) {
        if (!trades.isEmpty()) {
            Trade t = trades.get(trades.size() - 1);
            System.out.println("  Last trade: " + t.getQuantity() + " @ $" + t.getPrice());
        }
    }
}
