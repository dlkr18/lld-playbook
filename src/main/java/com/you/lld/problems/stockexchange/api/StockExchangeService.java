package com.you.lld.problems.stockexchange.api;

import com.you.lld.problems.stockexchange.model.Order;
import com.you.lld.problems.stockexchange.model.Trade;
import com.you.lld.problems.stockexchange.model.OrderType;

import java.util.List;

/**
 * Service interface for stock exchange operations.
 * Supports order placement, matching, and trade execution.
 */
public interface StockExchangeService {
    
    /**
     * Places a new order.
     * 
     * @param order Order to place
     * @return Order ID
     */
    String placeOrder(Order order);
    
    /**
     * Cancels an existing order.
     * 
     * @param orderId Order ID to cancel
     * @return true if cancelled successfully
     */
    boolean cancelOrder(String orderId);
    
    /**
     * Gets an order by ID.
     * 
     * @param orderId Order ID
     * @return Order if found, null otherwise
     */
    Order getOrder(String orderId);
    
    /**
     * Gets all open orders for a stock.
     * 
     * @param symbol Stock symbol
     * @return List of open orders
     */
    List<Order> getOpenOrders(String symbol);
    
    /**
     * Gets all orders for a user.
     * 
     * @param userId User ID
     * @return List of user orders
     */
    List<Order> getUserOrders(String userId);
    
    /**
     * Gets all executed trades for a stock.
     * 
     * @param symbol Stock symbol
     * @return List of trades
     */
    List<Trade> getTrades(String symbol);
    
    /**
     * Gets current best bid price for a stock.
     * 
     * @param symbol Stock symbol
     * @return Best bid price, or 0 if no bids
     */
    double getBestBid(String symbol);
    
    /**
     * Gets current best ask price for a stock.
     * 
     * @param symbol Stock symbol
     * @return Best ask price, or 0 if no asks
     */
    double getBestAsk(String symbol);
    
    /**
     * Manually triggers order matching for a symbol.
     * 
     * @param symbol Stock symbol
     * @return Number of trades executed
     */
    int matchOrders(String symbol);
}


