package com.you.lld.examples.week2.day6.factory;

import java.util.HashMap;
import java.util.Map;

/**
 * Factory class for creating PaymentProcessor instances.
 * 
 * This demonstrates the Factory pattern by:
 * - Encapsulating object creation logic
 * - Supporting multiple payment processor types
 * - Providing a single point of configuration
 * - Enabling easy addition of new payment methods
 */
public class PaymentProcessorFactory {
    
    // Registry of payment processors
    private static final Map<PaymentMethod, Class<? extends PaymentProcessor>> processorRegistry = new HashMap<>();
    
    // Static initialization of supported processors
    static {
        processorRegistry.put(PaymentMethod.CREDIT_CARD, CreditCardProcessor.class);
        processorRegistry.put(PaymentMethod.DEBIT_CARD, DebitCardProcessor.class);
        processorRegistry.put(PaymentMethod.PAYPAL, PayPalProcessor.class);
        processorRegistry.put(PaymentMethod.BANK_TRANSFER, BankTransferProcessor.class);
        // Add more processors as needed
    }
    
    /**
     * Create a payment processor for the specified payment method.
     * 
     * @param paymentMethod The payment method to create a processor for
     * @return PaymentProcessor instance
     * @throws IllegalArgumentException if payment method is not supported
     */
    public static PaymentProcessor createProcessor(PaymentMethod paymentMethod) {
        if (paymentMethod == null) {
            throw new IllegalArgumentException("Payment method cannot be null");
        }
        
        Class<? extends PaymentProcessor> processorClass = processorRegistry.get(paymentMethod);
        if (processorClass == null) {
            throw new IllegalArgumentException("Unsupported payment method: " + paymentMethod);
        }
        
        try {
            return processorClass.getDeclaredConstructor().newInstance();
        } catch (Exception e) {
            throw new RuntimeException("Failed to create payment processor for " + paymentMethod, e);
        }
    }
    
    /**
     * Create a payment processor with configuration.
     * This method demonstrates how factories can handle configuration.
     * 
     * @param paymentMethod The payment method
     * @param config Configuration parameters
     * @return Configured PaymentProcessor instance
     */
    public static PaymentProcessor createProcessor(PaymentMethod paymentMethod, PaymentProcessorConfig config) {
        PaymentProcessor processor = createProcessor(paymentMethod);
        
        // Configure the processor if it supports configuration
        if (processor instanceof ConfigurablePaymentProcessor) {
            ((ConfigurablePaymentProcessor) processor).configure(config);
        }
        
        return processor;
    }
    
    /**
     * Register a new payment processor type.
     * This allows for runtime extension of supported payment methods.
     * 
     * @param paymentMethod The payment method
     * @param processorClass The processor class
     */
    public static void registerProcessor(PaymentMethod paymentMethod, 
                                       Class<? extends PaymentProcessor> processorClass) {
        if (paymentMethod == null || processorClass == null) {
            throw new IllegalArgumentException("Payment method and processor class cannot be null");
        }
        
        processorRegistry.put(paymentMethod, processorClass);
    }
    
    /**
     * Check if a payment method is supported.
     * 
     * @param paymentMethod The payment method to check
     * @return true if supported, false otherwise
     */
    public static boolean isSupported(PaymentMethod paymentMethod) {
        return paymentMethod != null && processorRegistry.containsKey(paymentMethod);
    }
    
    /**
     * Get all supported payment methods.
     * 
     * @return Array of supported payment methods
     */
    public static PaymentMethod[] getSupportedPaymentMethods() {
        return processorRegistry.keySet().toArray(new PaymentMethod[0]);
    }
    
    /**
     * Factory method that automatically selects the best processor based on criteria.
     * This demonstrates intelligent factory selection.
     * 
     * @param amount The transaction amount
     * @param currency The currency
     * @param availableMethods Available payment methods for the user
     * @return Recommended PaymentProcessor
     */
    public static PaymentProcessor createOptimalProcessor(java.math.BigDecimal amount, 
                                                         String currency, 
                                                         PaymentMethod... availableMethods) {
        if (availableMethods == null || availableMethods.length == 0) {
            throw new IllegalArgumentException("At least one payment method must be available");
        }
        
        // Simple selection logic - in real world, this would be more sophisticated
        // considering factors like fees, processing time, success rates, etc.
        
        // For small amounts, prefer digital wallets
        if (amount.compareTo(java.math.BigDecimal.valueOf(50)) < 0) {
            for (PaymentMethod method : availableMethods) {
                if (method == PaymentMethod.APPLE_PAY || method == PaymentMethod.GOOGLE_PAY) {
                    if (isSupported(method)) {
                        return createProcessor(method);
                    }
                }
            }
        }
        
        // For larger amounts, prefer credit cards
        if (amount.compareTo(java.math.BigDecimal.valueOf(1000)) > 0) {
            for (PaymentMethod method : availableMethods) {
                if (method == PaymentMethod.CREDIT_CARD) {
                    return createProcessor(method);
                }
            }
        }
        
        // Default to first available supported method
        for (PaymentMethod method : availableMethods) {
            if (isSupported(method)) {
                return createProcessor(method);
            }
        }
        
        throw new IllegalArgumentException("No supported payment methods available");
    }
}
